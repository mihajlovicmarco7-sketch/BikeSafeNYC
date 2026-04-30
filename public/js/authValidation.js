(function () {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');
  const showError = (message) => {
    let error = document.querySelector('.client-error');

    if (!error) {
      error = document.createElement('p');
      error.className = 'client-error error';
      document.querySelector('form').prepend(error);
    }

    error.textContent = message;
  };

  const isValidPassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  };

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        event.preventDefault();
        showError('All fields are required');
        return;
      }

      if (username.length < 3 || username.length > 25) {
        event.preventDefault();
        showError('Username must be between 3 and 25 characters');
        return;
      }

      if (!isValidPassword(password)) {
        event.preventDefault();
        showError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
        return;
      }

      if (password !== confirmPassword) {
        event.preventDefault();
        showError('Passwords do not match');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      const identifier = document.getElementById('identifier').value.trim();
      const password = document.getElementById('password').value;

      if (!identifier || !password) {
        event.preventDefault();
        showError('Username/email and password are required');
      }
    });
  }
})();