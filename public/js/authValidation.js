(function () {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  const showError = (form, message) => {
    let error = form.querySelector('.client-error');

    if (!error) {
      error = document.createElement('p');
      error.className = 'client-error error-message';
      form.prepend(error);
    }

    error.textContent = message;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidUsername = (username) => {
    return /^[a-zA-Z0-9_]+$/.test(username);
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
        showError(signupForm, 'All fields are required');
        return;
      }

      if (username.length < 3 || username.length > 25) {
        event.preventDefault();
        showError(signupForm, 'Username must be between 3 and 25 characters');
        return;
      }

      if (!isValidUsername(username)) {
        event.preventDefault();
        showError(signupForm, 'Username may only contain letters, numbers, and underscores');
        return;
      }

      if (!isValidEmail(email)) {
        event.preventDefault();
        showError(signupForm, 'Please enter a valid email address');
        return;
      }

      if (!isValidPassword(password)) {
        event.preventDefault();
        showError(
          signupForm,
          'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'
        );
        return;
      }

      if (password !== confirmPassword) {
        event.preventDefault();
        showError(signupForm, 'Passwords do not match');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      const identifier = document.getElementById('identifier').value.trim();
      const password = document.getElementById('password').value;

      if (!identifier || !password) {
        event.preventDefault();
        showError(loginForm, 'Username/email and password are required');
      }
    });
  }
})();