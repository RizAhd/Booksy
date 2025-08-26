async function SignUp() {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const password = document.getElementById("password").value;

    const user = {
        firstName: firstname,
        lastName: lastname,
        email: email,
        mobile: mobile,
        password: password
    };

    const userJson = JSON.stringify(user);

    const response = await fetch(
            "SignUp",
            {
                method: "POST",

                header: {
                    "Content-Type": "application/json"
                },
                body: userJson



            });



    if (response.ok) {//success
        const json = await response.json();
        if (json.status) {//if true
            //redirect another page

            window.location = "verify.html";
            
        } else {//when false
            //custom message


            document.getElementById("message").innerHTML = json.message;

        }
    } else {
        document.getElementById("message").innerHTML = "Registration fail. please try again";
    }


}



document.addEventListener('DOMContentLoaded', function() {
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the email from the form
            const email = document.getElementById('email').value;
            
            // Store email in sessionStorage to pass to verify page
            sessionStorage.setItem('signupEmail', email);
            
            // Continue with form submission
            this.classList.add('loading');
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Creating Account...';
            
          
        });
    }

    // Verification page - Set the email on page load
    const verifyEmailElement = document.querySelector('.verify-header strong');
    if (verifyEmailElement && window.location.pathname.includes('verify.html')) {
        // Get email from sessionStorage
        const signupEmail = sessionStorage.getItem('signupEmail');
        if (signupEmail) {
            verifyEmailElement.textContent = signupEmail;
            // Clear the stored email after using it
            sessionStorage.removeItem('signupEmail');
        }
    }
});