function indexOnloadFunctions() {
//    checkSession();
    loadProductData();
}

async function CheckSession() {

    const response = await fetch("CheckSession");

    if (response.ok) {



    } else {


        showToast("Something went wrong. Please try again.", "error");

    }

}

async function loadProductData() {

    
    const response = await fetch("LoadIndexData");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            console.log(json);
         loadCategories(json);
        } else {
                   showToast("Something went wrong. Please try again.", "error");
        }
    } else {
               showToast("Something went wrong. Please try again.", "error");
    }
}


async function loadCategories(json) {
    const load_categories_container = document.getElementById("category-container");
    load_categories_container.innerHTML = "";  // Clear the container before appending new content

    // Add a single header for all categories
    let category_card = `
      
        <div class="categories-grid">
    `;

    // Loop through each category item in the list
    json.categoryList.forEach(item => {
        category_card += `
            <a href="#" class="category-card">
                <div class="category-icon">
                    <i class="fas fa-book"></i>  <!-- Default icon -->
                </div>
                <h3>${item.type}</h3>  <!-- Display category type dynamically -->
                <p>Available Books</p>  
            </a>
        `;
    });

    // Close the categories grid div
    category_card += `</div>`;

    // Append the category cards (with a single header and grid) to the container
    load_categories_container.innerHTML = category_card;
}








//
////async function addToCart(bookId, qty) {
//   const response = await fetch("AddCart?BId=" + bookId + "&qty=" + qty);
//
//        if (response.ok) {
//            
//            const json = await response.json();
//            
//            if (json.status) {
//                
//                showToast(json.message, "success");
//                
//            } else {
//                
//                showToast("Something went wrong. Please try again.", "error");
//            }
//            
//        } else {
//            
//            showToast("Something went wrong. Please try again.", "error");
//        }
//    
//
//}