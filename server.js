// modules importation
const express = require("express")
const dotenv = require("dotenv")
const routes = require("./routes/index")

// configuration
const app = express()
dotenv.config()


// middlewares
app.use(express.json())
app.use("/api/v1", routes)


// server
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})