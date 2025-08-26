payhere.onCompleted = function onCompleted(orderId) {
    showToast("Payment completed. OrderID:" + orderId,"success");
};

// Payment window closed
payhere.onDismissed = function onDismissed() {
    // Note: Prompt user to pay again or show an error page
    console.log("Payment dismissed");
};

// Error occurred
payhere.onError = function onError(error) {
    // Note: show an error page
    console.log("Error:" + error);
};



async function loadCheckOut() {
    const response = await fetch("CheckOut");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            
            const user = json.sessionUser;
            const userAddress = json.userAddress;
            const cityList = json.cityList;
            const cartItems = json.cartList;
            const deliveryTypes = json.deliveryTypes;

            let city_select = document.getElementById("citySelect");

            cityList.forEach(city => {
                let option = document.createElement("option");
                option.value = city.id;
                option.innerHTML = city.name;
                city_select.appendChild(option);
            });

            const current_address_checkbox = document.getElementById("checkbox1");
            current_address_checkbox.addEventListener("change", function () {
                let email = document.getElementById("email");
                let first_name = document.getElementById("first-name");
                let last_name = document.getElementById("last-name");
                let line_one = document.getElementById("address");
                let line_two = document.getElementById("address2");
                let postal_code = document.getElementById("zip");
                let mobile = document.getElementById("phone");
                if (current_address_checkbox.checked) {
                    email.value = userAddress.user.email;
                    first_name.value = userAddress.user.first_name;
                    last_name.value = userAddress.user.last_name;
                    city_select.value = userAddress.city.id;
                    city_select.disabled = false;
                    city_select.dispatchEvent(new Event("change"));
                    line_one.value = userAddress.lineOne;
                    line_two.value = userAddress.lineTwo;
                    postal_code.value = userAddress.postalCode;
                    mobile.value = userAddress.mobile;
                } else {
                    first_name.value = "";
                    last_name.value = "";
                    city_select.value = 0;
                    city_select.disabled = false;
                    city_select.dispatchEvent(new Event("change"));
                    line_one.value = "";
                    line_two.value = "";
                    postal_code.value = "";
                    mobile.value = "";
                }
            });

            let st_tbody = document.getElementById("st-tbody");
            let st_item_tr = document.querySelector(".order-item");  // Use querySelector to select the template
            let st_subtotal_tr = document.querySelector(".st-subtotal");
            let st_order_shipping_tr = document.querySelector(".st-order-shipping");
            let st_order_total_tr = document.querySelector(".st-order-total");

            st_tbody.innerHTML = "";

            let total = 0;
            let item_count = 0;
            cartItems.forEach(cart => {
                let st_item_tr_clone = st_item_tr.cloneNode(true);
                st_item_tr_clone.querySelector(".st-product-title").innerHTML = cart.books.title;
                st_item_tr_clone.querySelector(".st-product-qty").innerHTML = `Quantity: ${cart.qty}`;
                item_count += cart.qty;
                let item_sub_total = Number(cart.qty) * Number(cart.books.price);
                const imageUrl = `Book-Img/${cart.books.id}/image1.png`;  // Use forward slashes for web paths
                st_item_tr_clone.querySelector(".order-item-img img").src = imageUrl;

                st_item_tr_clone.querySelector(".st-product-price").innerHTML = new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2
                }).format(item_sub_total);

                st_tbody.appendChild(st_item_tr_clone);

                total += item_sub_total;
            });

            st_subtotal_tr.querySelector(".summary-value").innerHTML = new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2
            }).format(total);

            st_tbody.appendChild(st_subtotal_tr);

            // Define the shipping charges variable
            let shipping_charges = 0;

            // Handle shipping method selection
            document.querySelectorAll('input[name="shipping"]').forEach(option => {
                option.addEventListener("change", () => {
                    // Get selected shipping method
                    const selectedShippingMethod = document.querySelector('input[name="shipping"]:checked').id;

                    // Determine shipping charges based on the selected method
                    if (selectedShippingMethod === "standard-shipping") {
                        shipping_charges = 200; // Standard shipping charge
                        st_order_shipping_tr.querySelector(".summary-value").innerHTML = `LKR ${shipping_charges}`;
                    } else if (selectedShippingMethod === "express-shipping") {
                        shipping_charges = 400; // Express shipping charge
                        st_order_shipping_tr.querySelector(".summary-value").innerHTML = `LKR ${shipping_charges}`;
                    } else if (selectedShippingMethod === "colombo-shipping") {
                        shipping_charges = 0; // Colombo shipping charge (free)
                        st_order_shipping_tr.querySelector(".summary-value").innerHTML = "Free";
                    }

                    // Update the total price
                    let totalPrice = total + shipping_charges;
                    st_order_total_tr.querySelector(".summary-value").innerHTML = new Intl.NumberFormat(
                        "en-US",
                        { minimumFractionDigits: 2 }
                    ).format(totalPrice);

                    // Ensure the changes are reflected in the DOM
                    st_tbody.appendChild(st_order_shipping_tr);
                    st_tbody.appendChild(st_order_total_tr);
                });
            });

            // Initialize the display by calling the function on page load (to set default selected shipping)
            const initialShippingMethod = document.querySelector('input[name="shipping"]:checked').id;
            if (initialShippingMethod === "standard-shipping") {
                shipping_charges = 200;
                st_order_shipping_tr.querySelector(".summary-value").innerHTML = `LKR ${shipping_charges}`;
            } else if (initialShippingMethod === "express-shipping") {
                shipping_charges = 400;
                st_order_shipping_tr.querySelector(".summary-value").innerHTML = `LKR ${shipping_charges}`;
            } else if (initialShippingMethod === "colombo-shipping") {
                shipping_charges = 0;
                st_order_shipping_tr.querySelector(".summary-value").innerHTML = "Free";
            }

            let initialTotal = total + shipping_charges;
            st_order_total_tr.querySelector(".summary-value").innerHTML = new Intl.NumberFormat(
                "en-US",
                { minimumFractionDigits: 2 }
            ).format(initialTotal);

            st_tbody.appendChild(st_order_shipping_tr);
            st_tbody.appendChild(st_order_total_tr);

            console.log(json);
        } else {
            if (json.message === "empty-cart") {
                showToast("Empty Cart! Add Some Products", "error");
                window.location = "index.html";
            } else {
                // Handle other error messages
                showToast(json.message, "error");
            }
        }
    } else {
        // Handle unauthorized access (401 status)
        if (response.status === 401) {
            window.location = "signin.html";
        }
    }
}


async function checkout() {
    let checkbox1 = document.getElementById("checkbox1").checked;
    let first_name = document.getElementById("first-name");
    let last_name = document.getElementById("last-name");
    let city_select = document.getElementById("citySelect");
    let line_one = document.getElementById("address");
    let line_two = document.getElementById("address2");
    let postal_code = document.getElementById("zip");
    let mobile = document.getElementById("phone");

    let data = {
        isCurrentAddress: checkbox1,
        firstName: first_name.value,
        lastName: last_name.value,
        citySelect: city_select.value,
        lineOne: line_one.value,
        lineTwo: line_two.value,
        postalCode: postal_code.value,
        mobile: mobile.value
    };
    let dataJSON = JSON.stringify(data);

    const response = await fetch("PayHere", {
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    });

   
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
//            // PayHere Process
            payhere.startPayment(json.payhereJson);
        } else {
            showToast(json.message,"error");
        }
    } else {
        showToast("Somthing went wrong. Please try again!","error");
    }
}