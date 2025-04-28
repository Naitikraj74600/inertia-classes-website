document.addEventListener('DOMContentLoaded', () => {
  const admissionForm = document.getElementById('admissionForm');
  const messageDiv = document.getElementById('message');
  const printAdmissionBtn = document.getElementById('printAdmissionBtn');

  let lastAdmittedStudent = null;

  admissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Removed photo file reading and base64 conversion

    const formData = {
      name: admissionForm.name.value,
      dob: admissionForm.dob.value,
      address: admissionForm.address.value,
      parentName: admissionForm.parentName.value,
      parentContact: admissionForm.parentContact.value,
      email: admissionForm.email.value,
      phone: admissionForm.phone.value,
      schoolCollegeName: admissionForm.schoolCollegeName.value,
      course: admissionForm.course.value
      // Removed photo from formData
    };

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        messageDiv.textContent = 'Admission submitted successfully! Your ID: ' + result.id;
        lastAdmittedStudent = { ...formData, admissionDate: new Date().toLocaleDateString(), id: result.id };
        admissionForm.reset();
      } else {
        messageDiv.textContent = 'Failed to submit admission.';
      }
    } catch (error) {
      messageDiv.textContent = 'Error submitting admission.';
      console.error(error);
    }
  });

  printAdmissionBtn.addEventListener('click', () => {
    const printWindow = window.open('', '', 'width=800,height=1000');
    const formData = lastAdmittedStudent || {
      name: admissionForm.name.value,
      dob: admissionForm.dob.value,
      address: admissionForm.address.value,
      parentName: admissionForm.parentName.value,
      parentContact: admissionForm.parentContact.value,
      email: admissionForm.email.value,
      phone: admissionForm.phone.value,
      schoolCollegeName: admissionForm.schoolCollegeName.value,
      course: admissionForm.course.value,
      admissionDate: new Date().toLocaleDateString()
    };

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
          .photo-placeholder {
            width: 160px;
            height: 200px;
            border: 2px dashed #000;
            margin: 20px auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="watermark">${instituteDetails.name}</div>
          <div class="institute-details">
            <img src="/assets/logo.jpg" alt="Institute Logo" style="height: 100px; display: block; margin: 0 auto 10px auto;" />
            <h1 style="font-family: 'Georgia', serif; font-size: 3rem; font-weight: bold; text-transform: uppercase; color: #004080; margin: 0;">${instituteDetails.name}</h1>
            <p>${instituteDetails.address}</p>
            <p>${instituteDetails.contact}</p>
          </div>
          <div class="photo-placeholder" title="Paste Passport Size Photo Here"></div>
          <h2>Admission Details</h2>
          <table>
            <tbody>
              <tr><th>Full Name</th><td>${formData.name}</td></tr>
              <tr><th>Date of Birth</th><td>${formData.dob}</td></tr>
              <tr><th>Address</th><td>${formData.address}</td></tr>
              <tr><th>Parent/Guardian Name</th><td>${formData.parentName}</td></tr>
              <tr><th>Parent/Guardian Contact</th><td>${formData.parentContact}</td></tr>
              <tr><th>Email</th><td>${formData.email}</td></tr>
              <tr><th>Phone Number</th><td>${formData.phone}</td></tr>
              <tr><th>School/College Name</th><td>${formData.schoolCollegeName}</td></tr>
              <tr><th>Course Interested</th><td>${formData.course}</td></tr>
              <tr><th>Admission ID</th><td>${formData.id || ''}</td></tr>
            </tbody>
          </table>
          <div class="stamp">Admission Date: ${formData.admissionDate}</div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  });
});
