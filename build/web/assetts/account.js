function loadData() {
    getUserData();
    getCityData();
}


async function getUserData() {
    const response = await fetch("Account");
    if (response.ok) {

        const json = await response.json();


        document.getElementById("username").innerHTML = `Hello, ${json.firstName} ${json.lastName}`;
        document.getElementById("since").innerHTML = `Booksy Member Since ${json.since}`;
        document.getElementById("firstName").value = json.firstName;
        document.getElementById("lastName").value = json.lastName;
        document.getElementById("email").value = json.email;
        document.getElementById("mobile").value = json.mobile;
        document.getElementById("currentPassword").value = json.password;
       
        
        

    } else {
    }

}

//async function getUserDat() {
//    const response = await fetch("Account");
//    if (response.ok) {
//        const json = await response.json();
//        document.getElementById("username").innerHTML = `Hello, ${json.firstName} ${json.lastName}`;
//        document.getElementById("since").innerHTML = `Smart Trade Member Since ${json.since}`;
//        document.getElementById("firstname").value = json.firstName;
//        document.getElementById("lastname").value = json.lastName;
//        document.getElementById("email").value = json.email;
//        document.getElementById("mobile").value = json.mobile;
//        document.getElementById("currentPassword").value = json.password;
//
//        if (json.hasOwnProperty("addressList") && json.addressList !== undefined) {
//            let email;
//            let lineOne;
//            let lineTwo;
//            let city;
//            let postalCode;
//            let cityId;
//            const addressUL = document.getElementById("addressUL");
//            json.addressList.forEach(address => {
//                email = address.user.email;
//                lineOne = address.lineOne;
//                lineTwo = address.lineTwo;
//                city = address.city.name;
//                postalCode = address.postalCode;
//                cityId = address.city.id;
//                const line = document.createElement("li");
//                line.innerHTML = lineOne + ",<br/>" +
//                        lineTwo + ",<br/>" +
//                        city + "<br/>" +
//                        postalCode;
//                addressUL.appendChild(line);
//            });
//            document.getElementById("addName").innerHTML = `Name: ${json.firstName} ${json.lastName}`;
//            document.getElementById("addEmail").innerHTML = `Email: ${email}`;
//            document.getElementById("contact").innerHTML = `Phone: 011-2215453`;
//
//            document.getElementById("lineOne").value = lineOne;
//            document.getElementById("lineTwo").value = lineTwo;
//            document.getElementById("postalCode").value = postalCode;
//            document.getElementById("citySelect").value = parseInt(cityId);
//        }
//    }
//
//}

async function getCityData() {
    const response = await fetch("CityData");
    if (response.ok) {
        const json = await response.json();
        const citySelect = document.getElementById("citySelect");
        json.forEach(city => {
            let option = document.createElement("option");
            option.innerHTML = city.name;
            option.value = city.id;
            citySelect.appendChild(option);
        });

    }
}

async function saveChanges() {


    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const lineOne = document.getElementById("lineOne").value;
    const lineTwo = document.getElementById("lineTwo").value;
    const mobile = document.getElementById("mobile").value;
    const postalCode = document.getElementById("postalCode").value;
    const cityId = document.getElementById("citySelect").value;
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const userDataObject = {
        firstName: firstName,
        lastName: lastName,
        lineOne: lineOne,
        lineTwo: lineTwo,
        mobile: mobile,
        postalCode: postalCode,
        cityId: cityId,
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };

    const userDataJSON = JSON.stringify(userDataObject);

    const response = await fetch("Account", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: userDataJSON
    });
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            getUserData();
               showToast("Profile Changes Updated Successfully","success");
     setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top smoothly
    location.reload();  // Refresh the page
}, 2000);
        } else {
            showToast(json.message,"error");
      
        }
    } else {
        document.getElementById("notification").innerHTML = "Profile details update failed!";
    }
}

