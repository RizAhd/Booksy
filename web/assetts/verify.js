

async function verifyAccount() {

    const verificationCode = document.getElementById("verifyCode").value;

    const verification = {

        verificationCode: verificationCode

    };

    const verificationJSON = JSON.stringify(verification);

    const response = await fetch(
            "Verify",
            {

                method: "POST",
                body: verificationJSON,
                header: {

                    "Content-Type": "application/json"
                }
            }

    );
    if (response.ok) {//success
        const json = await response.json();
        if (json.status) {//if true
            window.location = "index.html";
        } else {//when false
            //custom message
            if (json.message === "1") {
                window.location = "signin.html";
            } else {

                document.getElementById("message").innerHTML = json.message;

            }


        }
    } else {
        document.getElementById("message").innerHTML = "Verification fail. please try again";
    }


}