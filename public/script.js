document.addEventListener('DOMContentLoaded', () => {
  const admissionForm = document.getElementById('admissionForm');
  const messageDiv = document.getElementById('message');
  const printAdmissionBtn = document.getElementById('printAdmissionBtn');

  let lastAdmittedStudent = null;

  admissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

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
    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      alert('Printing is not supported on smartphones. Please use a desktop or laptop to print.');
      return;
    }

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
              padding: 15px;
              position: relative;
              margin: 0;
              font-size: 14px;
            }
            .container {
              border: 2px solid #000;
              padding: 15px;
              position: relative;
              box-sizing: border-box;
              max-height: 850px;
              height: 80vh;
            }
            h1, h2 {
              text-align: center;
              margin: 8px 0;
              font-size: 22px;
            }
            .institute-details {
              text-align: center;
              margin-bottom: 15px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px 10px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .watermark {
              display: none;
            }
            .stamp {
              position: relative;
              bottom: auto;
              right: auto;
              border: 2px solid #000;
              padding: 8px 12px;
              font-weight: bold;
              font-size: 14px;
              background: rgba(255, 255, 255, 0.8);
              z-index: 1;
              margin-top: 15px;
              text-align: right;
            }
            .passport-photo-space {
              width: 3.5cm;
              height: 4.5cm;
              border: 2px dashed #000;
              margin: 0 0 15px 0;
              display: block;
              text-align: center;
              line-height: 4.5cm;
              font-weight: bold;
              font-size: 0.9rem;
              color: #555;
              font-family: Arial, sans-serif;
            }
            .signature {
              margin-top: 15px;
              text-align: right;
              font-family: 'Georgia', serif;
              font-size: 1rem;
              font-weight: bold;
              border-top: 2px solid #000;
              width: 180px;
              padding-top: 5px;
              margin-right: 10px;
            }
            @media (max-width: 600px) {
              .container {
                height: auto;
                padding: 10px;
              }
              .stamp {
                font-size: 12px;
                padding: 8px 12px;
                margin-top: 15px;
              }
              .passport-photo-space {
                width: 3cm;
                height: 4cm;
                line-height: 4cm;
                font-size: 0.8rem;
                margin: 0 0 15px 0;
              }
              .signature {
                width: 150px;
                margin-right: 10px;
                font-size: 1rem;
              }
            }
          </style>
      </head>
      <body>
        <div class="container">
          <div class="watermark"></div>
          <div class="institute-details">
            <img src="/assets/logo.jpg" alt="Institute Logo" style="height: 100px; display: block; margin: 0 auto 10px auto;" />
            <h1 style="font-family: 'Georgia', serif; font-size: 3rem; font-weight: bold; text-transform: uppercase; color: #004080; margin: 0;">${instituteDetails.name}</h1>
            <p>${instituteDetails.address}</p>
            <p>${instituteDetails.contact}</p>
          </div>
          <div class="passport-photo-space">Paste Passport Size Photo Here</div>
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
          <div class="signature">Authorized Signature</div>
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
