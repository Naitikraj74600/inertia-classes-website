document.addEventListener('DOMContentLoaded', () => {
  // Redirect to login if not logged in
  if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  const totalStudentsSpan = document.getElementById('totalStudents');
  const totalFeesSpan = document.getElementById('totalFees');
  const admissionsTableBody = document.querySelector('#admissionsTable tbody');
  const feesTableBody = document.querySelector('#feesTable tbody');

  // Fetch all students and update total count and recent admissions
  async function fetchStudents() {
    try {
      const response = await fetch('/api/students');
      if (!response.ok) throw new Error('Failed to fetch students');
      const students = await response.json();

      totalStudentsSpan.textContent = students.length;

      // Sort by admissionDate descending and take top 5 recent admissions
      const recentAdmissions = students
        .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
        .slice(0, 5);

      admissionsTableBody.innerHTML = '';
      if (recentAdmissions.length === 0) {
        admissionsTableBody.innerHTML = '<tr><td colspan="4">No admissions found</td></tr>';
      } else {
        recentAdmissions.forEach(student => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${new Date(student.admissionDate).toLocaleDateString()}</td>
          `;
          admissionsTableBody.appendChild(tr);
        });
      }
    } catch (error) {
      totalStudentsSpan.textContent = 'Error';
      admissionsTableBody.innerHTML = '<tr><td colspan="4">Error loading admissions</td></tr>';
      console.error(error);
    }
  }

  // Fetch all fees and update total fees collected and recent fee transactions
  async function fetchFees() {
    try {
      const response = await fetch('/api/fees/all');
      if (!response.ok) throw new Error('Failed to fetch fees');
      const fees = await response.json();

      const totalFees = fees.reduce((sum, fee) => sum + (fee.amountPaid || 0), 0);
      totalFeesSpan.textContent = totalFees.toFixed(2);

      // Sort by transactionDate descending and take top 5 recent fee transactions
      const recentFees = fees
        .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
        .slice(0, 5);

      feesTableBody.innerHTML = '';
      if (recentFees.length === 0) {
        feesTableBody.innerHTML = '<tr><td colspan="4">No fee transactions found</td></tr>';
      } else {
        recentFees.forEach(fee => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${fee.id}</td>
            <td>${fee.studentId}</td>
            <td>${fee.amountPaid}</td>
            <td>${new Date(fee.transactionDate).toLocaleDateString()}</td>
          `;
          feesTableBody.appendChild(tr);
        });
      }
    } catch (error) {
      totalFeesSpan.textContent = 'Error';
      feesTableBody.innerHTML = '<tr><td colspan="4">Error loading fee transactions</td></tr>';
      console.error(error);
    }
  }

  // Initialize dashboard data
  fetchStudents();
  fetchFees();
});
