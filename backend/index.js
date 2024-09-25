const express = require("express")
const cors = require("cors")
const connect = require("./config/db")
const userRouter = require("./routes/user.route")
const { libraryRouter } = require("./routes/library.route")
const auth = require("./middlewares/auth.middleware")
const bookModel = require("./models/library.model")
const app = express()
require("dotenv").config()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())

app.get("/library/getbooks", async (req, res) => {
    try {
        let books = await bookModel.find();
        
        if (!books.length) {
            return res.status(404).json({ message: "No books found" });
        }
        
        res.status(200).json({ message: "Your Books", books }); // Note the change to 'books'
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


app.use("/user",userRouter)
app.use("/library",auth,libraryRouter)

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    connect()
})