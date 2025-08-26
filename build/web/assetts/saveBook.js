async function saveBooks() {
//    const popup = new Notification();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const isbn = document.getElementById("isbn").value;
    const publishedYear = document.getElementById("publishedYear").value;
    const qty = document.getElementById("qty").value;

    const categoryID = document.getElementById("category").value;
    const languageId = document.getElementById("language").value;
    const statusId = document.getElementById("status").value;
    const typeId = document.getElementById("type").value;
    const formatId = document.getElementById("format").value;

    const image1 = document.getElementById("imageUpload1").files[0];
    const image2 = document.getElementById("imageUpload2").files[0];
    const image3 = document.getElementById("imageUpload3").files[0];
    const image4 = document.getElementById("imageUpload4").files[0];


    const form = new FormData();

    form.append("title", title);
    form.append("author", author);
    form.append("isbn", isbn);
    form.append("description", description);
    form.append("price", price);
    form.append("publishedYear", publishedYear);
    form.append("qty", qty);
    form.append("categoryID", categoryID);
    form.append("languageId", languageId);
    form.append("statusId", statusId);
    form.append("typeId", typeId);
    form.append("formatId", formatId);

    form.append("image1", image1);
    form.append("image2", image2);
    form.append("image3", image3);
    form.append("image4", image4);

    const response = await fetch(
            "SaveBooks", {
                method: "POST",

                body: form
            });

if (response.ok) {
    const json = await response.json();
    console.log(json);  // Debugging: check what json contains

    if (json.status) {
        // If status is true, show success message
        showToast("New Product Added Successfully", 'success');
            resetForm();
      
    } else {
        // If status is false, show the message from the API
        const errorMessage = json.message || "Something went wrong!";
        showToast(errorMessage, 'error');
        console.log("bye");
    }
} else {
    // Handle failed response, if necessary
    showToast("Failed to communicate with the server", 'error');
     console.log("byedwfeadf");

}

// Function to reset the form fields



}

function resetForm() {
    // Reset the text inputs
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
    document.getElementById("description").value = "";
    document.getElementById("price").value = "";
    document.getElementById("publishedYear").value = "";
    document.getElementById("category").value = "";
    document.getElementById("language").value = "";
    document.getElementById("status").value = "";
    document.getElementById("type").value = "";
    document.getElementById("format").value = "";
    document.getElementById("qty").value = 1;

    // Reset the file input fields
    document.getElementById("imageUpload1").value = "";
    document.getElementById("imageUpload2").value = "";
    document.getElementById("imageUpload3").value = "";
    document.getElementById("imageUpload4").value = "";

    // Reset the image previews (clear them)
    document.getElementById("preview1").src = "";
    document.getElementById("preview2").src = "";
    document.getElementById("preview3").src = "";
    document.getElementById("preview4").src = "";

    // Optionally, hide the remove buttons after resetting
    document.querySelector(".remove-image1").style.display = 'none';
    document.querySelector(".remove-image2").style.display = 'none';
    document.querySelector(".remove-image3").style.display = 'none';
    document.querySelector(".remove-image4").style.display = 'none';
}

