document.addEventListener('DOMContentLoaded', () => {
  const studentTableBody = document.querySelector('#studentTable tbody');

  // Fetch all students
  async function fetchStudents() {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const students = await response.json();
      return students;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Render students in table
  async function renderStudents() {
    const students = await fetchStudents();
    studentTableBody.innerHTML = '';
    students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.id}</td>
        <td><img src="${student.photo || ''}" alt="Photo" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; margin-right: 8px; vertical-align: middle;" />${student.name}</td>
        <td>${student.email}</td>
        <td>${student.phone}</td>
        <td>${student.course}</td>
        <td>
          <button data-id="${student.id}" class="print-btn">Print</button>
          <button data-id="${student.id}" class="modify-btn">Modify</button>
          <button data-id="${student.id}" class="delete-btn">Delete</button>
        </td>
      `;
      studentTableBody.appendChild(tr);
    });
  }

  // Delete student
  async function deleteStudent(id) {
    try {
      const response = await fetch('/api/students/' + id, { method: 'DELETE' });
      if (response.ok) {
        alert('Student deleted successfully');
        renderStudents();
      } else {
        alert('Failed to delete student');
      }
    } catch (error) {
      alert('Error deleting student');
      console.error(error);
    }
  }

  // Handle button clicks (delete, print, modify)
  studentTableBody.addEventListener('click', (e) => {
    const id = e.target.getAttribute('data-id');
    if (e.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete this student?')) {
        deleteStudent(id);
      }
    } else if (e.target.classList.contains('print-btn')) {
      printStudent(id);
    } else if (e.target.classList.contains('modify-btn')) {
      modifyStudent(id);
    }
  });

  // Print student admission details
  async function printStudent(id) {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const students = await response.json();
      const student = students.find(s => s.id === id);
      if (!student) {
        alert('Student not found');
        return;
      }

      const printWindow = window.open('', '', 'width=800,height=1000');
      const instituteDetails = {
        name: "Inertia Classes",
        address: "123 Main Street, City, State, ZIP",
        contact: "Phone: 123-456-7890 | Email: info@inertiaclasses.com"
      };

      const content = `
        <html>
        <head>
          <title>Print Admission</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              position: relative;
              margin: 0;
            }
            .container {
              border: 3px solid #000;
              padding: 20px;
              position: relative;
              height: 950px;
              box-sizing: border-box;
            }
            h1, h2 {
              text-align: center;
              margin: 0;
            }
            .institute-details {
              text-align: center;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .watermark {
              position: absolute;
              top: 40%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 72px;
              color: rgba(0, 0, 0, 0.1);
              user-select: none;
              pointer-events: none;
              z-index: 0;
            }
            .stamp {
              position: absolute;
              bottom: 20px;
              right: 20px;
              border: 2px solid #000;
              padding: 10px 20px;
              font-weight: bold;
              font-size: 14px;
              background: rgba(255, 255, 255, 0.8);
              z-index: 1;
            }
            .photo {
              display: block;
              margin: 0 auto 20px auto;
              width: 150px;
              height: 150px;
              object-fit: cover;
              border-radius: 50%;
              border: 2px solid #000;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="watermark">${instituteDetails.name}</div>
            <div class="institute-details">
              <img src="/logo.png" alt="Institute Logo" style="width: 120px; display: block; margin: 0 auto 10px auto;" />
              <h1>${instituteDetails.name}</h1>
              <p>${instituteDetails.address}</p>
              <p>${instituteDetails.contact}</p>
            </div>
            <h2>Admission Details</h2>
            <img src="${student.photo || ''}" alt="Student Photo" class="photo" />
            <table>
              <tbody>
                <tr><th>Full Name</th><td>${student.name}</td></tr>
                <tr><th>Date of Birth</th><td>${student.dob || ''}</td></tr>
                <tr><th>Address</th><td>${student.address || ''}</td></tr>
                <tr><th>Parent/Guardian Name</th><td>${student.parentName || ''}</td></tr>
                <tr><th>Parent/Guardian Contact</th><td>${student.parentContact || ''}</td></tr>
                <tr><th>Email</th><td>${student.email}</td></tr>
                <tr><th>Phone Number</th><td>${student.phone}</td></tr>
                <tr><th>School/College Name</th><td>${student.schoolCollegeName || ''}</td></tr>
                <tr><th>Course Interested</th><td>${student.course}</td></tr>
                <tr><th>Admission ID</th><td>${student.id}</td></tr>
                <tr><th>Admission Date</th><td>${new Date(student.admissionDate).toLocaleDateString()}</td></tr>
              </tbody>
            </table>
            <div class="stamp">Admission Date: ${new Date(student.admissionDate).toLocaleDateString()}</div>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    } catch (error) {
      alert('Error printing student details');
      console.error(error);
    }
  }

  // Modify student details (simple prompt-based for demo)
  async function modifyStudent(id) {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const students = await response.json();
      const student = students.find(s => s.id === id);
      if (!student) {
        alert('Student not found');
        return;
      }

      // Prompt for new values (for demo purposes)
      const newName = prompt('Enter new name:', student.name);
      if (newName === null) return; // Cancelled
      const newEmail = prompt('Enter new email:', student.email);
      if (newEmail === null) return;
      const newPhone = prompt('Enter new phone:', student.phone);
      if (newPhone === null) return;
      const newCourse = prompt('Enter new course:', student.course);
      if (newCourse === null) return;

      const updatedStudent = {
        ...student,
        name: newName,
        email: newEmail,
        phone: newPhone,
        course: newCourse
      };

      const updateResponse = await fetch('/api/students/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent)
      });

      if (updateResponse.ok) {
        alert('Student updated successfully');
        renderStudents();
      } else {
        alert('Failed to update student');
      }
    } catch (error) {
      alert('Error updating student');
      console.error(error);
    }
  }

  // Initial render
  renderStudents();
});
