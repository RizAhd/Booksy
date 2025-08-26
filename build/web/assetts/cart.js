async function loadCartItems() {
    const response = await fetch("LoadCartBooks");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {

            const cart_item_container = document.getElementById("cart-table");
            cart_item_container.innerHTML = ""; // Clear the existing items before appending new ones

            let total = 0;
            let totalQty = 0;

            json.cartItems.forEach(cart => {
                let productSubTotal = cart.books.price * cart.qty;
                total += productSubTotal;
                totalQty += cart.qty;
                let tableData = `
                 
                     
                    <tr>
                        <td data-label="Product">
                            <div class="cart-item">
                                <div class="cart-item-img">
                                    <img src="Book-Img\\${cart.books.id}\\image1.png" alt="Books">
                                </div>
                                <div class="cart-item-details">
                                    <h3 class="cart-item-title">${cart.books.title}</h3>
                                    <p class="cart-item-author">${cart.books.author}</p>
                                    <span class="cart-item-price">${cart.books.price}</span>
                                </div>
                            </div>
                        </td>
                        <td data-label="Price">${new Intl.NumberFormat("en-US", {minimumFractionDigits: 2}).format(cart.books.price)}</td>
                        <td data-label="Quantity">
                            <div class="quantity-selector">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" class="quantity-input" value="${cart.qty}" min="1">
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </td>
                        <td data-label="Subtotal"> ${new Intl.NumberFormat("en-US",
                        {minimumFractionDigits: 2})
                        .format(productSubTotal)}</td>
                        <td>
                            <div class="cart-item-remove">
                                <i class="fas fa-trash-alt"></i>
                                <span>Remove</span>
                            </div>
                        </td>
                    </tr> `;



                // Append each cart item to the table
                cart_item_container.innerHTML += tableData;
            });
            document.getElementById("order-total-quantity").innerHTML = totalQty;
             document.getElementById("order-total-amount2").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2})
                    .format(total);
            document.getElementById("order-total-amount").innerHTML = new Intl.NumberFormat("en-US",
                    {minimumFractionDigits: 2})
                    .format(total);
        } else {
            showToast(json.message, "error");
        }
    } else {
        showToast("Cart Items Loading Failed.", "error");
    }
}
