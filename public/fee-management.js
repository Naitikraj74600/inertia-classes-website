document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if not logged in
  if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  const feeForm = document.getElementById('feeForm');
  const feeTableBody = document.querySelector('#feeTable tbody');

  // Fetch all students to display in the table
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

  // Fetch fee details for a student
  async function fetchFeeDetails(studentId) {
    try {
      const response = await fetch(`/api/fees/${studentId}`);
      if (!response.ok) return null;
      const fees = await response.json();
      // Return the latest fee entry if multiple
      return fees[fees.length - 1];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  // Render the fee table
  async function renderFeeTable() {
    const students = await fetchStudents();
    feeTableBody.innerHTML = '';
    for (const student of students) {
      const fee = await fetchFeeDetails(student.id);
      const amountPaid = fee ? fee.amountPaid : 0;
      const totalFee = fee ? fee.totalFee : 0;
      const dues = totalFee - amountPaid;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${amountPaid}</td>
        <td>${totalFee}</td>
        <td>${dues}</td>
        <td><button data-student-id="${student.id}" class="print-btn">Print</button></td>
      `;
      feeTableBody.appendChild(tr);
    }
  }

  // Generate print content for fee details
  function generatePrintContent(student, fee) {
    const amountPaid = fee ? fee.amountPaid : 0;
    const totalFee = fee ? fee.totalFee : 0;
    const dues = totalFee - amountPaid;

    return `
      <html>
      <head>
        <title>Fee Details Print</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; color: #004080; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        </style>
      </head>
      <body>
        <h1>Inertia Classes Fee Details</h1>
        <table>
          <tr><th>Student ID</th><td>${student.id}</td></tr>
          <tr><th>Name</th><td>${student.name}</td></tr>
          <tr><th>Amount Paid</th><td>${amountPaid}</td></tr>
          <tr><th>Total Fee</th><td>${totalFee}</td></tr>
          <tr><th>Dues</th><td>${dues}</td></tr>
          <tr><th>Print Date & Time</th><td>${new Date().toLocaleString()}</td></tr>
        </table>
      </body>
      </html>
    `;
  }

  // Handle fee form submission
  feeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentId = feeForm.studentId.value.trim();
    const amountPaid = parseFloat(feeForm.amountPaid.value);
    const totalFee = parseFloat(feeForm.totalFee.value);

    if (!studentId || isNaN(amountPaid) || isNaN(totalFee)) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      const response = await fetch('/api/fees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, amountPaid, totalFee })
      });

      if (response.ok) {
        alert('Fee details saved successfully.');
        feeForm.reset();
        renderFeeTable();
      } else {
        alert('Failed to save fee details.');
      }
    } catch (error) {
      alert('Error saving fee details.');
      console.error(error);
    }
  });

  // Handle print button clicks
  feeTableBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('print-btn')) {
      const studentId = e.target.getAttribute('data-student-id');
      const students = await fetchStudents();
      const student = students.find(s => s.id === studentId);
      if (!student) {
        alert('Student not found.');
        return;
      }
      const fee = await fetchFeeDetails(studentId);
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(generatePrintContent(student, fee));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  });

  // Initial render
  renderFeeTable();
});
