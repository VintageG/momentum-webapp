
        const oldPasswordInput = document.getElementById('oldPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const submitBtn = document.getElementById('submitBtn');
        const successAlert = document.getElementById('successAlert');
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        // Password requirements
        const requirements = {
            length: { regex: /.{8,}/, element: 'req-length' },
            uppercase: { regex: /[A-Z]/, element: 'req-uppercase' },
            lowercase: { regex: /[a-z]/, element: 'req-lowercase' },
            number: { regex: /[0-9]/, element: 'req-number' },
            special: { regex: /[!@#$%^&*]/, element: 'req-special' }
        };

        // Check password requirements
        function checkRequirements(password) {
            let metCount = 0;
            
            for (const [key, req] of Object.entries(requirements)) {
                const element = document.getElementById(req.element);
                const icon = element.querySelector('.requirement-icon');
                
                if (req.regex.test(password)) {
                    element.classList.add('met');
                    icon.textContent = '✓';
                    metCount++;
                } else {
                    element.classList.remove('met');
                    icon.textContent = '○';
                }
            }

            // Update strength bar
            strengthBar.className = 'password-strength-bar';
            if (metCount <= 2) {
                strengthBar.classList.add('weak');
                strengthText.textContent = 'Weak password';
            } else if (metCount <= 4) {
                strengthBar.classList.add('medium');
                strengthText.textContent = 'Medium password';
            } else {
                strengthBar.classList.add('strong');
                strengthText.textContent = 'Strong password';
            }

            return metCount === 5;
        }

        // Real-time password validation
        newPasswordInput.addEventListener('input', function() {
            checkRequirements(this.value);
        });

        // Form submission
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide alerts
            successAlert.classList.remove('show');
            errorAlert.classList.remove('show');

            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validation
            if (!oldPassword) {
                showError('Please enter your old password');
                return;
            }

            if (!checkRequirements(newPassword)) {
                showError('Password does not meet all requirements');
                return;
            }

            if (newPassword !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            if (oldPassword === newPassword) {
                showError('New password must be different from old password');
                return;
            }

            // Simulate password change
            submitBtn.disabled = true;
            submitBtn.textContent = 'Changing...';

            setTimeout(() => {
                successAlert.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Change Password';
                
                // Reset form
                document.getElementById('passwordForm').reset();
                strengthBar.className = 'password-strength-bar';
                strengthText.textContent = '';
                
                // Reset requirements
                Object.values(requirements).forEach(req => {
                    const element = document.getElementById(req.element);
                    element.classList.remove('met');
                    element.querySelector('.requirement-icon').textContent = '○';
                });

                // Hide success message after 3 seconds
                setTimeout(() => {
                    successAlert.classList.remove('show');
                }, 3000);
            }, 1000);
        });

        function showError(message) {
            errorMessage.textContent = message;
            errorAlert.classList.add('show');
            setTimeout(() => {
                errorAlert.classList.remove('show');
            }, 5000);
        }

        // Cancel button
        document.getElementById('cancelBtn').addEventListener('click', function() {
            if (confirm('Discard changes?')) {
                document.getElementById('passwordForm').reset();
                strengthBar.className = 'password-strength-bar';
                strengthText.textContent = '';
            }
        });

        // Back button
        document.getElementById('backBtn').addEventListener('click', function() {
            alert('Navigate back to settings');
        });
