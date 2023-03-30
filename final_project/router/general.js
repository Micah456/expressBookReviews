const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get("/users", (req, res) => {
    return res.status(200).json(users)
})

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password
  if(username && password){
    if(isValid(username)){
        users.push({
            username : username,
            password : password
        })
        return res.status(200).json({message: `Customer ${username} has been successfully registered. Now you can log in.`});
    }
    else{
        return res.status(400).json({message: "This username is not valid"});
    }
  }
  else{
      return res.status(400).json({message: "Please enter a username or password"});
  }

  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

//Promise get booklist
public_users.get("/async", function (req, res){
    let myPromise = new Promise((resolve, reject) => {
        res.status(200).json(books);
    })
    myPromise.then(() => {
        return res
    })
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  return res.status(200).json(book);
});

//Promise get book using isbn
public_users.get("/async/isbn/:isbn", function (req, res){
    let myPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        const book = books[isbn]
        res.status(200).json(book);
    })
    myPromise.then(() => {
        return res
    })
})
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  let authorsBooks = []
  let isbns = Object.keys(books)
  isbns.forEach(isbn => {
      let book = books[isbn]
      if(book["author"] == author){
          let bookObj = {
              isbn : isbn,
              title : book["title"],
              reviews : book["reviews"]
          }
          authorsBooks.push(bookObj)
      }
  })
  return res.status(200).json({booksbyauthor : authorsBooks});
});

//Promise get books by author
public_users.get("/async/author/:author", function (req, res){
    let myPromise = new Promise((resolve, reject) => {
        const author = req.params.author
        let authorsBooks = []
        let isbns = Object.keys(books)
        isbns.forEach(isbn => {
            let book = books[isbn]
            if(book["author"] == author){
                let bookObj = {
                    isbn : isbn,
                    title : book["title"],
                    reviews : book["reviews"]
                }
                authorsBooks.push(bookObj)
            }
        })
        res.status(200).json({booksbyauthor : authorsBooks});
    })
    myPromise.then(() => {
        return res
    })
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title
  let titlesBooks = []
  let isbns = Object.keys(books)
  isbns.forEach(isbn => {
      let book = books[isbn]
      if(book["title"] == title){
          let bookObj = {
              isbn : isbn,
              author : book["author"],
              reviews : book["reviews"]
          }
          titlesBooks.push(bookObj)
      }
  })
  return res.status(200).json({booksbytitle : titlesBooks})
});

//Promise get books by title
public_users.get("/async/title/:title", function (req, res){
    let myPromise = new Promise((resolve, reject) => {
        const title = req.params.title
    let titlesBooks = []
    let isbns = Object.keys(books)
    isbns.forEach(isbn => {
        let book = books[isbn]
        if(book["title"] == title){
            let bookObj = {
                isbn : isbn,
                author : book["author"],
                reviews : book["reviews"]
            }
            titlesBooks.push(bookObj)
        }
    })
    res.status(200).json({booksbytitle : titlesBooks})
    })
    myPromise.then(() => {
        return res
    })
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]

  return res.status(200).json(book["reviews"]);
});

module.exports.general = public_users;
