const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let foundUser = {}
    for(let i = 0; i < users.length; i++){
        if(users[i]['username'] == username)
        return false
    }
    return true
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let foundUser = {}
    for(let i = 0; i < users.length; i++){
        if(users[i]['username'] == username)
        foundUser = users[i]
        break
    }
    if(foundUser){
        return (password == foundUser['password'])
    }
    else{
        return False
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if(!username || !password){
      return res.status(404).json({message: "Error logging in: Please enter username and password"})
    }
    if(authenticatedUser(username, password)){
      let accessToken = jwt.sign({
          data : password
      }, 'access', {expiresIn: 60 * 60})
      req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("Customer successfully logged in")
    }
    else return res.status(208).json({message: "Invalid login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.query.review
    const username = req.session.authorization["username"]
    books[isbn]["reviews"][username] = review
  //Write your code here
  return res.status(200).json({message: `The review for book with ISBN: ${isbn} has been added/updated`});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization["username"]
    delete books[isbn]["reviews"][username]
    return res.status(200).json({message: `The reivew for book with ISBN: ${isbn} posted by user ${username} has been deleted`})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
