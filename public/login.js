document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      username: loginForm.username.value,
      password: loginForm.password.value
    };

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // Redirect to dashboard on successful login
        window.location.href = 'dashboard.html';
      } else {
        const result = await response.json();
        loginMessage.textContent = result.message || 'Login failed';
        loginMessage.style.color = 'red';
      }
    } catch (error) {
      loginMessage.textContent = 'Error during login';
      loginMessage.style.color = 'red';
      console.error(error);
    }
  });
});
