const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const userRoute = require("./routes/userRoute")
const deviceRoute = require("./routes/deviceRoute")
const errorHandler = require("./middlewares/errorMiddleware")
const cookieParser = require("cookie-parser")
const path = require("path")


const app = express()

//Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())

//URL frontend
app.use(cors({
    origin: ["http://localhost:3000", "https://geapp.vercel.app"],
    credentials: true
}))

//Use Path Images uploads
app.use("/uploads/devices", express.static(path.join(__dirname, "uploads/devices")));

//Routes Middleware
app.use("/api/users", userRoute)
app.use("/api/devices", deviceRoute)

//Routes Middlewares
app.get("/", (req, res) => {
    res.send("Home Page")
})
app.get("/api", (req, res) => {
    res.send("Welcome to GEAPP-API")
})
//Error Middleware
app.use(errorHandler)

//Connect to DB and start Server
const PORT = process.env.PORT || 5000
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT} || DB conected ✅`)
        })
    })
    .catch((err) => console.log(err))