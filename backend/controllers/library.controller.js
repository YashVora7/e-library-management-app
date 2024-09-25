const bookModel = require("../models/library.model");

const createBook = async (req, res) => {
  let { title, author, genre, availability } = req.body;

  let newBook = new bookModel({
    title,
    author,
    genre,
    availability,
    user: req.user.userId,
  });

  await newBook.save();
  res.status(201).json({ message: "Book created successfully", book: newBook });
  
};

const getBook = async (req, res) => {
  let book = await bookModel.find({ user: req.user.userId });

  if (!book.length) {
    return res.status(404).json({ message: "No books found" });
  }
  res.status(201).json({ message: "Your Books", book });
};

const getBookById = async (req, res) => {
  let { id } = req.params;

  let book = await bookModel.findOne({ _id: id, user: req.user.userId });
  // console.log(book);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(201).json({ message: "Your Book", book });
};

const updateBook = async (req, res) => {
  let { id } = req.params;
  let { title, author, genre, availability } = req.body;
  let book = await bookModel.findOneAndUpdate(
    { _id: id, user: req.user.userId },
    { title, author, genre, availability },
    { new: true }
  );

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(201).json({ message: "Your Book Updated", book });
};

const deleteBook = async (req, res) => {
  let { id } = req.params;
  let book = await bookModel.findOneAndDelete({
    _id: id,
    user: req.user.userId,
  });
  if (!book) {
    return res.status(400).json({ error: "Book not found" });
  }
  res.status(201).json({ message: "Your Book Deleted", book });
};

const borrowBook = async (req, res) => {
  const { id } = req.params;

  let book = await bookModel.findOne({ _id: id });

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (!book.availability) {
    return res.status(400).json({ error: "Book is already borrowed" });
  }

  book.availability = false;
  book.borrowedBy = req.user.userId;
  await book.save();

  res.status(200).json({ message: "Book borrowed successfully", book });
};

const returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    let book = await bookModel.findOne({ _id: id });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (book.borrowedBy.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({
          error: "You can't return this book because you didn't borrow it",
        });
    }

    book.availability = true;
    book.borrowedBy = null;
    await book.save();

    res.status(200).json({ message: "Book returned successfully", book });
  } catch (error) {
    res.status(500).json({error,details:error.message})
  }
};

module.exports = {
  createBook,
  getBook,
  getBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
};
