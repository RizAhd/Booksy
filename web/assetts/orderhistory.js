function loadOrderHistory() {
    fetch("Order", {  // Update URL if necessary
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched Data:', data);  // Log the data to inspect its structure

        if (data.status) {
            const orderContainer = document.querySelector('.order-history-container');
            orderContainer.innerHTML = '';  // Clear existing content

            // Check if data.orders is an array
            const orders = data.orders;

            if (Array.isArray(orders)) {
                orders.forEach(order => {
                    // Safety check to make sure 'order_item' exists
                    if (order.order_item) {
                        let orderHtml = `
                            <div class="order-card">
                                <div class="order-header">
                                    <div>
                                        <div class="order-number">Order #${order.order_id}</div>
                                        <div class="order-date">Placed on ${order.created_at}</div>
                                    </div>
                                    <div class="order-status status-delivered">${order.order_status}</div>
                                </div>
                                <div class="order-details">
                                    <div class="order-items">
                                        <div class="order-item">
                                            <div class="order-item-img">
                                                <img src="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1976&q=80" alt="Book Cover">
                                            </div>
                                            <div class="order-item-details">
                                                <h4 class="order-item-title">${order.order_item.book_title || 'N/A'}</h4>
                                                <p class="order-item-author">${order.order_item.book_author || 'Unknown Author'}</p>
                                                <span class="order-item-price">$${order.order_item.price || '0.00'}</span>
                                                <p class="order-item-qty">Quantity: ${order.order_item.quantity || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        orderContainer.innerHTML += orderHtml;
                    } else {
                        console.error("Order item is missing for order ID: ", order.order_id);
                    }
                });
            } else {
                console.error("Orders are not in an array format:", data.orders);
            }
        } else {
            const errorContainer = document.querySelector('.empty-state');
            errorContainer.style.display = 'block';
            errorContainer.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching order history:', error);
    });
}
