const express = require("express")
const router = express.Router()
const { registerUser, loginUser, logout, getUser, loginStatus, updateUser, getUsers, changePassword, forgotPassword, resetPassword, deleteUser } = require("../controllers/userController")
const protect = require("../middlewares/authMiddleware")
const isAdmin = require("../middlewares/isAdmin")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/getusers", protect, isAdmin, getUsers)
router.delete("/deleteuser/:id", protect, isAdmin, deleteUser)
router.get("/loggedin", loginStatus)
router.patch("/updateuser", protect, updateUser)
router.patch("/changepassword", protect, changePassword)
router.post("/forgotPassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)

module.exports = router