const mongoose = require("mongoose");
const { Schema } = mongoose;

//create bookSchema
const bookSchema = new Schema({
    comments:[String],
    title: {type: String , required: true},
    commentcount: {type: Number, default: 0}
});

//create Book model
const Book = mongoose.model('Book', bookSchema);

exports.Book =Book;