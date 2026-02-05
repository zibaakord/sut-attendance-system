document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('userID').value;
  const password = document.getElementById('userPassword').value;

  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.message);
    return;
  }

  localStorage.setItem('token', data.token);
  localStorage.setItem('role', data.user.role);

  if (data.user.role === 'PROFESSOR') {
    window.location.href = '../professor/dashboard.html';
  }
});
