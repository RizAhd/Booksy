async function viewAllBooks() {

    const response = await fetch("LoadData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
//            document.getElementById("all-item-count").innerHTML = json.allBookCount + " " + "Products";
            loadOptions("language", json.languageList, "name");
            loadOptions("status", json.statusList, "name");
            loadOptions("category", json.categoryList, "type");
            loadOptions("type", json.typeList, "name");
            loadOptions("format", json.formatList, "name");
            updateBookView(json);
//console.log(json.statusList);
//console.log(json.categoryList);
await searchProduct(0);
        } else {
            showToast('Form cleared', 'success');
        }
    } else {
        showToast('Form cleared', 'success');
    }
}

function loadOptions(prefix, dataList, property) {
    let options = document.getElementById(prefix + "-options");
    let li = document.getElementById(prefix + "-li");
    options.innerHTML = "";  // Clear any previous options

    dataList.forEach(item => {
        let li_clone = li.cloneNode(true);  // Clone the li template

        // Update the content of the cloned li based on the property
        if (prefix === "category") {
            li_clone.style.borderColor = "black";
            li_clone.querySelector(".category-text").innerHTML = item[property];  // Update category text
        } else {
            li_clone.querySelector(".filter-text").innerHTML = item[property];  // Update other text (type, format, etc.)
        }

        options.appendChild(li_clone);  // Append the cloned li to the options
    });


    // Add event listeners to toggle "chosen" class when an item is clicked
    const all_li = document.querySelectorAll("#" + prefix + "-options li");
    all_li.forEach(list => {
        list.addEventListener("click", function () {
            // Remove "chosen" class from all other list items
            all_li.forEach(y => {
                y.classList.remove("chosen");
            });

            // Add "chosen" class to the clicked list item
            this.classList.add("chosen");

        });
    });
}

async function searchProduct(firstResult) {
    const category_name = document.getElementById("category-options")
            .querySelector(".chosen")?.querySelector(".filter-text").textContent;

    const language_name = document.getElementById("language-options")
            .querySelector(".chosen")?.querySelector(".filter-text").textContent;
    const type_name = document.getElementById("type-options")
            .querySelector(".chosen")?.querySelector(".filter-text").textContent;
    const status_name = document.getElementById("status-options")
            .querySelector(".chosen")?.querySelector(".filter-text").textContent;

    const format_name = document.getElementById("format-options")
            .querySelector(".chosen")?.querySelector(".filter-text").textContent;

    // Get the min and max values from the range inputs
    const price_range_start = document.querySelector(".range-min").value;
    const price_range_end = document.querySelector(".range-max").value;
    const sort_value = document.getElementById("sort").value;

    const data = {
        categoryName: category_name,
        languageName: language_name,
        typeName: type_name,
        statusName: status_name,
        formatName: format_name,
        priceStart: price_range_start,
        priceEnd: price_range_end,
        sortValue: sort_value,
        firstResult: firstResult *6 // This value should be passed to the backend for pagination
    };

    const dataJSON = JSON.stringify(data);

    const response = await fetch("SearchBooks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: dataJSON
    });

    if (response.ok) {
        const json = await response.json();

        // Check if booksList is an array and has elements
        if (json.status) {
            updateBookView(json);  // Update the book list and pagination
            showToast('Product Loading Complete', 'success');
        } else {
            showToast('No books found or invalid data', 'error');
        }
    } else {
        showToast('Something went wrong. Please try again later', 'error');
    }
}


const st_product = document.getElementById("st-product");
let st_pagination_button = document.getElementById("pagination-button");
let current_page = 0;

function updateBookView(json) {
    const book_container = document.getElementById("book-container");
    book_container.innerHTML = "";  // Clear the container before adding new books

    // Get the book template
    const bookTemplate = document.getElementById("book-template");

    // If the template is not found, log an error
    if (!bookTemplate) {
        console.error("Book template not found in the DOM.");
        return;
    }

    // Check if booksList is an array and is valid
    if (!Array.isArray(json.booksList)) {
        console.error("Invalid booksList:", json.booksList);
        return;
    }

    // Log the books list for debugging
    console.log(json.booksList);

    // Loop through the books list and clone the template for each book
    json.booksList.forEach(book => {
        // Log book details for debugging
        console.log(book.id, book.title, book.author, book.price);

        // Clone the template content
        let st_book_clone = document.importNode(bookTemplate.content, true);

        // Set the "Quick View" link
        const quickViewLink = "singleproductpage.html?id=" + book.id;
        st_book_clone.querySelector(".quick-view button").setAttribute("onclick", `window.location.href='${quickViewLink}'`);

        // Set the book image source (fixed path)
        const imagePath = "Book-Img/" + book.id + "/image1.png";
        st_book_clone.querySelector(".book-img").setAttribute("src", imagePath);

        st_book_clone.querySelector(".book-title").textContent = book.title;
        st_book_clone.querySelector(".book-author").textContent = book.author;
        st_book_clone.querySelector(".current-price").textContent = "$" + book.price;

        st_book_clone.querySelector("#addcart").addEventListener("click", (e) => {
            addToCart(book.id, 1);
            e.preventDefault();
        });

        st_book_clone.querySelector(".current-price").innerHTML = new Intl.NumberFormat(
            "en-US", { minimumFractionDigits: 2 }
        ).format(book.price);

        // Add the cloned book card to the container
        book_container.appendChild(st_book_clone);
    });

    let st_pagination_container = document.getElementById("st-pagination-container");
    st_pagination_container.innerHTML = "";

    let all_books_count = json.allBooksCount;
    document.getElementById("all-item-count").innerHTML = all_books_count;

    let books_per_page = 6;
    let pages = Math.ceil(all_books_count / books_per_page); // round upper integer 


 //previous-button
    if (current_page !== 0) {
        let st_pagination_button_prev_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_prev_clone.innerHTML = "Prev";
        st_pagination_button_prev_clone.addEventListener(
                "click", (e) => {
            current_page--;
            searchProduct(current_page * books_per_page);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_prev_clone);
    }


    for (let i = 0; i < pages; i++) {
    let st_pagination_button_clone = st_pagination_button.cloneNode(true);
    st_pagination_button_clone.innerHTML = i + 1;
    st_pagination_button_clone.addEventListener("click", (e) => {
        current_page = i;
        searchProduct(i);  // Just pass the page number now
        e.preventDefault();
    });
    
    if (i === Number(current_page)) {
        st_pagination_button_clone.classList.add("btn-primary");
        st_pagination_button_clone.classList.remove("btn-outline-secondary");
    } else {
        st_pagination_button_clone.classList.add("btn-outline-secondary");
        st_pagination_button_clone.classList.remove("btn-primary");
    }
    st_pagination_container.appendChild(st_pagination_button_clone);
}

    // next-button
    if (current_page !== (pages - 1)) {
        let st_pagination_button_next_clone = st_pagination_button.cloneNode(true);
        st_pagination_button_next_clone.innerHTML = "Next";
        st_pagination_button_next_clone.addEventListener(
                "click", (e) => {
            current_page++;
            searchProduct(current_page *books_per_page);
            e.preventDefault();
        });
        st_pagination_container.appendChild(st_pagination_button_next_clone);
    }


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