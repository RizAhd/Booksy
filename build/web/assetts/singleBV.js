document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');  // e.g., singleproductpage.html?id=58

    if (!bookId) {
        console.error("Book ID is missing in the URL");
        return; // Exit the function if no book ID is provided
    }

    // Fetch and display the book details
    loadBookDetails(bookId);
});

// Function to fetch book details by ID from the backend (Servlet)
async function loadBookDetails(bookId) {
    try {
        const response = await fetch(`GetBookDetails?id=${bookId}`);  // Send GET request to backend
        const json = await response.json();  // Parse the JSON response

        if (json.status && json.book) {
            const book = json.book;  // Book object returned from backend

            // Set the book details (title, author, price, description, etc.)
            document.getElementById("book-t").textContent= book.title;
                  document.getElementById("qtyy").textContent= "Available Books"+ " "+ book.qty;
             document.getElementById("pub").textContent= "Published Year" + "  " + book.publishedYear;
            document.getElementById("desc").textContent= book.description;
            document.querySelector('.product-title').textContent = book.title;
            document.querySelector('.product-author').textContent = `By ${book.author}`;
            document.querySelector('.product-price').textContent = `$${book.price.toFixed(2)}`;
            document.querySelector('.product-description').textContent = book.description;
            document.querySelector('.main-image img').setAttribute("src", `Book-Img/${book.id}/image1.png`);

            // Dynamically set the thumbnail images (image1.png, image2.png, etc.)
            document.getElementById('thumbnail-1').setAttribute("src", `Book-Img/${book.id}/image1.png`);
            document.getElementById('thumbnail-2').setAttribute("src", `Book-Img/${book.id}/image2.png`);
            document.getElementById('thumbnail-3').setAttribute("src", `Book-Img/${book.id}/image3.png`);
            document.getElementById('thumbnail-4').setAttribute("src", `Book-Img/${book.id}/image4.png`);
            
            //add-to-cart-main-button
                const addToCartMain = document.getElementById("add-to-cart-main");
                addToCartMain.addEventListener(
                        "click", (e) => {
                    addToCart(json.book.id, document.getElementById("add-to-cart-qty").value);
                    e.preventDefault();
                });
                //add-to-cart-main-button-end

            // Add event listeners to the thumbnails to update the main image on click
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach((thumbnail) => {
                thumbnail.addEventListener('click', () => {
                    // Change the main image to the clicked thumbnail's image
                    document.querySelector('.main-image img').setAttribute("src", thumbnail.src);

                    // Highlight the clicked thumbnail
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
            });
        } else {
            console.error("Book not found or invalid data");
        }
    } catch (error) {
        console.error("Error fetching book details:", error);  // Log any errors during fetch
    }
    
    
async function addToCart(bookId, qty) {
   const response = await fetch("AddCart?BId=" + bookId + "&qty=" + qty);

        if (response.ok) {
            
            const json = await response.json();
            
            if (json.status) {
                
                showToast(json.message, "success");
                
            } else {
                
                showToast("Something went wrong. Please try again.", "error");
            }
            
        } else {
            
            showToast("Something went wrong. Please try again.", "error");
        }
    } 

}