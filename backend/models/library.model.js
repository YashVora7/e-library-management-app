const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book-user",
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book-user",
    required: true,
  },
});

const bookModel = new mongoose.model("book", bookSchema);

module.exports = bookModel;
