const {Router} = require("express")
const { createBook, getBook, getBookById, updateBook, deleteBook, borrowBook, returnBook } = require("../controllers/library.controller")
const libraryRouter = Router()

libraryRouter.post("/add",createBook)
libraryRouter.get("/get",getBook)
libraryRouter.get("/get/:id",getBookById)
libraryRouter.patch("/update/:id",updateBook)
libraryRouter.delete("/delete/:id",deleteBook)
libraryRouter.post("/borrow/:id", borrowBook);
libraryRouter.post("/return/:id", returnBook);

module.exports = {libraryRouter}