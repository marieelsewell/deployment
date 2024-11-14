console.log("connected")

let libraryWrapper = document.querySelector("section");
// QUESTION FOR LORA: I don't understand putting the hashtag with query selector
let inputTitle = document.querySelector("#input-title-name");
let inputAuthor = document.querySelector("#input-author-name");
let inputGenre = document.querySelector("#input-genre");
let inputRead = document.querySelector("#input-boolean");
let inputRating = document.querySelector("#input-rating");
let saveBookButton = document.querySelector("#save-book-button");

if (!libraryWrapper || !inputTitle || !inputAuthor || !inputGenre || !inputRead || !inputRating || !saveBookButton) {
    console.error("Error: One or more required DOM elements are missing.");
}

let editId = null;

function saveBookToServer() {
    // QUESTION FOR LORA: what does ncodeURIComponent do?
    let data = "title=" + encodeURIComponent(inputTitle.value);
    // QUESTION FOR LORA: why do we need the '&'
    data += "&author=" + encodeURIComponent(inputAuthor.value);
    data += "&genre=" + encodeURIComponent(inputGenre.value);
    data += "&is_read=" + encodeURIComponent(inputRead.value);
    data += "&rating=" + encodeURIComponent(inputRating.value);

    let URL = "http://localhost:8080/library";
    let method = "POST";
    if(editId) {
        URL = "http://localhost:8080/library/" + editId;
        method = "PUT";
    }

    fetch(URL, {
        method: method,
        body: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
            // QUESTION FOR LORA: why do we need ^ and where do we get it from?
        }
    }).then(function(response) {
        console.log("New Book Saved!", response);
        libraryWrapper.textContent = "";
        loadBooksFromServer();
    })

    inputTitle.value = "";
    inputAuthor.value = "";
    inputGenre.value = "";
    inputRead.value = "";
    inputRating.value = "";
    editId = null;
}

function addBook(data) {
    try {
        if (!data || !data.title || !data.author || !data.genre || data.is_read === undefined || !data.rating) {
            throw new Error("Incomplete book data provided.");
        }

        let bookTitle = document.createElement("h5");
        let bookAuthor = document.createElement("h5");
        let bookGenre = document.createElement("h5");
        let bookRead = document.createElement("h5");
        let bookRating = document.createElement("h5");
        let editButton = document.createElement("button");
        let deleteButton = document.createElement("button");

        bookTitle.textContent = "Title: " + data.title;
        bookAuthor.textContent = "Author: " + data.author;
        bookGenre.textContent = "Genre: " + data.genre;
        bookRead.textContent = data.is_read == 1 ? "Read" : "Not Read";
        bookRating.textContent = "My Rating: " + data.rating;
        editButton.textContent = "Edit";
        deleteButton.textContent = "Delete";

        libraryWrapper.appendChild(bookTitle);
        libraryWrapper.appendChild(bookAuthor);
        libraryWrapper.appendChild(bookGenre);
        libraryWrapper.appendChild(bookRead);
        libraryWrapper.appendChild(bookRating);
        libraryWrapper.appendChild(editButton);
        libraryWrapper.appendChild(deleteButton);
        libraryWrapper.appendChild(document.createElement("hr"));

        editButton.onclick = function() {
            inputTitle.value = data.title;
            inputAuthor.value = data.author;
            inputGenre.value = data.genre;
            inputRead.value = data.is_read;
            inputRating.value = data.rating;
            editId = data.id;
        };

        deleteButton.onclick = function() {
            if (confirm("Do you want to delete this item?")) {
                deleteBookFromServer(data.id);
                console.log("Item deleted.");
            } else {
                console.log("Action canceled.");
            }
        };
    } catch (error) {
        console.error("Error in addBook:", error.message);
    }
}

function loadBooksFromServer() {
    console.log("Entered load function");
    fetch("http://localhost:8080/library")
    .then(function(response) {
        response.json().then(function(data){
            console.log(data);
            let books = data;
            books.forEach(addBook);
        })
    }).catch(function(error) {
        console.error("Network error:", error);
    });
}

saveBookButton.onclick = saveBookToServer;       
loadBooksFromServer();

function deleteBookFromServer(id) {
    let URL = "http://localhost:8080/library/" + id;

    fetch(URL, {
        method: "DELETE"
    }).then(function(response) {
        if (response.ok) {
            console.log("Book Deleted!", response);
            libraryWrapper.textContent = "";  
            loadBooksFromServer();  
        } else {
            console.error("Error deleting book");
        }
    }).catch(function(error) {
        console.error("Network error:", error);
    });
}