async function loadBookData() {

    const response = await fetch("LoadBook");
    if (response.ok) {
        const json = await response.json();
        if (json.status) {
            loadSelect("category", json.categoryList, "type");

            loadSelect("language", json.languageList, "name");
            loadSelect("status", json.statusList, "name");
            loadSelect("type", json.typeList, "name");
            loadSelect("format", json.formatList, "name");
        } else {
            document.getElementById("toast").innerHTML = "Something went wrong. Please try again later";
        }
    } else {
        document.getElementById("toast").innerHTML = "Book Adding failed. Please try again";
    }

}
function loadSelect(selectId, items, property) {
    const select = document.getElementById(selectId);
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item[property];
        select.appendChild(option);
    });
}


//async function saveProduct() {
////    const popup = new Notification();
//
//    const title = document.getElementById("title").value;
//    const author = document.getElementById("author").value;
//    const description = document.getElementById("description").value;
//    const price = document.getElementById("price").value;
//    const isbn = document.getElementById("isbn").value;
//    const publishedYear = document.getElementById("publishedYear").value;
//    const qty = document.getElementById("qty").value;
//
//    const categoryID = document.getElementById("category").value;
//    const languageId = document.getElementById("language").value;
//    const statusId = document.getElementById("status").value;
//    const typeId = document.getElementById("type").value;
//    const formatId = document.getElementById("format").value;
//
////    const image1 = document.getElementById("img1").files[0];
////    const image2 = document.getElementById("img2").files[0];
////    const image3 = document.getElementById("img3").files[0];
////    const image4 = document.getElementById("img4").files[0];
//
//
//    const form = new FormData();
//
//    form.append("title", title);
//    form.append("author", author);
//    form.append("isbn", isbn);
//    form.append("description", description);
//    form.append("price", price);
//    form.append("publishedYear", publishedYear);
//    form.append("qty", qty);
//    form.append("categoryID", categoryID);
//    form.append("languageId", languageId);
//    form.append("statusId", statusId);
//    form.append("typeId", typeId);
//    form.append("formatId", formatId);
//
////
////    form.append("image1", image1);
////    form.append("image2", image2);
////    form.append("image3", image3);
////    form.append("image4", image4);
//    const response = await fetch("SaveBooks", {
//        method: "POST",
//          headers: {
//            "Content-Type": "application/json"
//        },
//        body: form
//    });
////    if (response.ok) {
////        const json = await response.json();
////        if (json.status) {
////            popup.success({
////                message: "New product added successfully"
////            });
//            document.getElementById("brand").value = 0;
//            document.getElementById("model").value = 0;
//            document.getElementById("title").value = "";
//            document.getElementById("description").value = "";
//            document.getElementById("storage").value = 0;
//            document.getElementById("color").value = 0;
//            document.getElementById("condition").value = 0;
//            document.getElementById("price").value = "0.00";
//            document.getElementById("qty").value = 1;
//            document.getElementById("img1").value = "";
//            document.getElementById("img2").value = "";
//            document.getElementById("img3").value = "";
////        } else {
////            if (json.message === "Please login") {
////                window.location = "sign-in.html";
////            } else {
////                popup.error({
////                    message: json.message
////                });
////            }
////        }
////    } else {
////
////    }
//
//}
//
//
//
