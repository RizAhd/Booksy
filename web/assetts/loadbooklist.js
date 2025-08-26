async function loadBookList() {
    const response = await fetch("LoadBookList");  // Fetch the books from the backend
    if (response.ok) {
        const data = await response.json();  // Parse the JSON response

        const tableBody = document.getElementById("booksTable").getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';  // Clear any existing rows

        if (data.status) {
            data.books.forEach(book => {
                const row = tableBody.insertRow();

                // Insert book details into table
                row.insertCell(0).textContent = book.title;
                row.insertCell(1).textContent = book.category.type;  // Category name
                row.insertCell(2).textContent = book.price;
                row.insertCell(3).textContent = book.qty;

                // Insert the book status
                const statusCell = row.insertCell(4);
                statusCell.textContent = book.status.name;  // Status name

                // Create delete button for each book
                const deleteCell = row.insertCell(5);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.className = 'btn btn-danger';
                deleteBtn.onclick = function() {
                    deleteBook(book.id);
                };
                deleteCell.appendChild(deleteBtn);
            });
        } else {
            alert(data.message);  // Show message if no books are found or an error occurs
            window.location="signin.html";
        }
    } else {
        alert("Failed to fetch books data.");
    }
}

function deleteBook(bookId) {
    if (confirm("Are you sure you want to delete this book?")) {
        fetch(`/deleteBook?id=${bookId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("Book deleted successfully");
                    loadBookList();  // Reload the book list after deletion
                } else {
                    alert("Failed to delete book");
                }
            });
    }
}
