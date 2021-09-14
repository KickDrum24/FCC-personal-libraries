
'use strict';
const mongoose = require("mongoose");
const bookModel = require("../model.js").Book;
const url = require('url');
const querystring = require('querystring');

module.exports = function (app) {

  app.route('/api/books')
    // .get(function (req, res) {
    //You can send a GET request to /api/books . The JSON response will be an array of objects 
    // with each object (book) containing title, _id, and commentcount properties.
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    .get((req, res) => {
      bookModel.find({}, '_id title commentcount').exec(function (err, books) {
        books.forEach(book => {
          console.log(book.title)
        });
        res.json(books);
      });
    })

    .post(function (req, res) {
      // let title = req.body.title;
      //response will contain new book object including atleast _id and title
      //if title is missing responshould be the string "missing required field title".
      //create new Book

      if (!req.body.title) {
        res.send("missing required field title")
        return;
      }
      const newBook = new bookModel({
        comments: [],
        title: req.body.title,
        commentcount: 0
      })
      newBook.save((err, dta) => {
        if (err || !dta) {
          console.log(err)
          res.send("Error saving book")
          return;
        } else {
          res.json(newBook)
        }
      })
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      bookModel.deleteMany({ Book: { $exists: true } }, req.body, (err, data) => {
        !err ? console.log("Deleted Many!") : console.log(err);
        res.send("complete delete successful")
      })
    });

  app.route('/api/books/:id')
    // You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing 
    // the properties title, _id, and a comments array (empty array if no comments present). 
    // If no book is found, return the string no book exists.

    .get(function (req, res) {
      let bookid = req.params.id;
      bookModel.findById(bookid, (err, book) => {
        !book ? res.send("no book exists") : res.json(book)
      })
    })

    // You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment 
    // to a book. The returned response will be the books object similar to GET /api/books/{_id} request in 
    // an earlier test. If comment is not included in the request, return the string 
    // missing required field comment. If no book is found, return the string no book exists.

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) {
        res.send("missing required field comment")
        return;
      }
      //find book
      bookModel.findByIdAndUpdate(bookid, {
        $push: { comments: comment },
        $inc: { commentcount: 1 }
      }, { new: true }, function (err, book) {
        if (!book) {
          res.send('no book exists')
          return;
        }
        res.json(book)
      });
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //send a DELETE request to /api/books/{_id} to delete a book from the collection. 
      //The returned response will be the string delete successful if successful. 
      //If no book is found, return the string no book exists
      console.log('delete request received')
      bookModel.findOneAndDelete({ _id: bookid }, (err, result) => {
        if (err) {
          console.log(err); return
        }
        if (!result) {
          res.send("no book exists")
        } else {
          res.send('delete successful')
        }
      })
    });

};
