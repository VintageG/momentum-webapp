        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        }

        function handleSignIn(event) {
            event.preventDefault();
            const email = event.target.querySelector('input[type="email"]').value;
            window.location.href = "dashboard.html";
        }
