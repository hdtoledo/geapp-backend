const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")


const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: [true, "Por favor agregar un nombre"],
        trim: true
    },
    lastname: {
        type: String,
        required: [true, "Por favor agregar un apellido"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Por favor agregar un correo"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Por favor ingresa un email valido"]
    },
    password: {
        type: String,
        required: [true, "Por favor agrega una contraseña"],
        minLength: [6, "La contraseña debe contener minimo 6 caracteres"],
    },
    role: {
        type: String,
        default: "user"
    },
    avatar: {
        type: String,
        default: "../uploads/avatar/defaultProfileAvatar.png"
    },
    phone: {
        type: String,
        default: "+573210000000"
    }
}, {
    timestamps: true
})

//Encrypt password before saving DB
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next()
    }

    //hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()

})

const User = mongoose.model("User", userSchema)
module.exports = User