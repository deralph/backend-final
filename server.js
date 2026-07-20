// modules importation
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const errorMiddleware = require("./middleware/error.middleware")
const routes = require("./routes/index")
const mongoose = require("mongoose")
const connectDB = require("./config/database")
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./config/swagger")


// configuration
const app = express()
dotenv.config()

// db
connectDB()

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",")

// middlewares
app.use(cors())
app.use(express.json())
app.use("/api/v1/", routes)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.get("/", (req, res)=> res.write("Welcome to Intelimerch"))
app.use(errorMiddleware)  //should remain last element on the list



// server
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})