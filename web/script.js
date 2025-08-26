




document.addEventListener('DOMContentLoaded', function() {
    
    // Floating labels
    const floatInputs = document.querySelectorAll('.floating input');
    floatInputs.forEach(input => {
        // Add placeholder with space to prevent jumping
        input.setAttribute('placeholder', ' ');
        
        // Check if input has value on page load
        if (input.value) {
            input.parentNode.querySelector('label').classList.add('active');
        }else{
            
           
            document.getElementById("message").innerHTML = "Please Agree to the Terms and Privacy Policy";
        }
        
        input.addEventListener('focus', function() {
            this.parentNode.querySelector('label').classList.add('active');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.querySelector('label').classList.remove('active');
            }
        });
    });
    
    // Toggle password visibility
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentNode.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const strengthBars = document.querySelectorAll('.strength-bar');
            const strengthValue = document.querySelector('.strength-value');
            const password = this.value;
            
            // Reset
            strengthBars.forEach(bar => {
                bar.style.backgroundColor = '';
                bar.style.width = '0%';
            });
            
            if (!password) {
                strengthValue.textContent = '';
                return;
            }
            
            // Calculate strength
            let strength = 0;
            let width = 0;
            
            // Length
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            
            // Uppercase
            if (/[A-Z]/.test(password)) strength++;
            
            // Numbers
            if (/[0-9]/.test(password)) strength++;
            
            // Special chars
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            
            // Update UI
            let strengthText = '';
            let color = '';
            
            if (strength <= 2) {
                strengthText = 'Weak';
                color = 'var(--error)';
                width = '25%';
            } else if (strength <= 4) {
                strengthText = 'Medium';
                color = 'var(--warning)';
                width = '50%';
            } else if (strength <= 6) {
                strengthText = 'Strong';
                color = 'var(--success)';
                width = '75%';
            } else {
                strengthText = 'Very Strong';
                color = 'var(--primary)';
                width = '100%';
            }
            
            strengthValue.textContent = strengthText;
            strengthValue.style.color = color;
            
            // Animate bars
            strengthBars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.backgroundColor = color;
                    bar.style.width = `${parseInt(width) / strengthBars.length}%`;
                }, index * 100);
            });
        });
    }
    
    
});


