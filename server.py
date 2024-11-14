from flask import Flask, request
from library import LibraryDB


app = Flask(__name__)

@app.route("/library/<int:book_id>", methods=["OPTIONS"])
def handle_cors_options(book_id):
    return "", 204, {
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Methods" : "PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

@app.route("/library", methods=["GET"])
def retrieve_all_books():
    db = LibraryDB("library_db.db")
    library = db.getAll()
    return library, 200, {"Access-Control-Allow-Origin" : "*"}

@app.route("/library/<int:book_id>", methods=["GET"])
def retrieve_one_book(book_id):
    db = LibraryDB("library_db.db")
    book = db.getOne(book_id)
    if not book:
        return f"book with {book_id} not found", 404, {"Access-Control-Allow-Origin": "*"}
    return book, 200, {"Access-Control-Allow-Origin" : "*"}
    

@app.route("/library", methods=["POST"])
def create_book():
    print("The request data is: ", request.form)
    title = request.form["title"]
    author = request.form["author"]
    genre = request.form["genre"]
    is_read = request.form["is_read"]
    rating = request.form["rating"]
    db = LibraryDB("library_db.db")
    db.create(title, author, genre, is_read, rating)
    return "Created", 201, {"Access-Control-Allow-Origin" : "*"}

@app.route("/library/<int:book_id>",methods=["PUT"])
def update_book(book_id):
    print("update book with ID")
    db = LibraryDB('library_db.db')
    book = db.getOne(book_id)
    if not book:
        return f"book with {book_id} not found", 404, {"Access-Control-Allow-Origin": "*"}
    
    title = request.form["title"]
    author = request.form["author"]
    genre = request.form["genre"]
    is_read = request.form["is_read"]
    rating = request.form["rating"]
    db.update(book_id, title, author, genre, is_read, rating)
    return "Updated", 200, {"Access-Control-Allow-Origin": "*"}

@app.route("/library/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    print("delete book with id")
    db = LibraryDB('library_db.db')  
    book = db.getOne(book_id)
    if not book:
        return f"book with {book_id} not found", 404, {"Access-Control-Allow-Origin": "*"}
    
    db.delete(book_id)
    return "Deleted", 200, {"Access-Control-Allow-Origin": "*"}

def run():
    app.run(port=8080, host='0.0.0.0')

if __name__ == "__main__":
    run()