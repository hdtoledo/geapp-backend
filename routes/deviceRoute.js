const express = require("express")
const protect = require("../middlewares/authMiddleware")
const { createDevice, getDevices, getDevice, deleteDevice, updateDevice } = require("../controllers/deviceController")
const isAdmin = require("../middlewares/isAdmin")
const { upload } = require("../utils/fileUpload")
const router = express.Router()


router.post("/", protect, isAdmin, upload.single("imagen"), createDevice)
router.patch("/:id", protect, isAdmin, upload.single("imagen"), updateDevice)
router.get("/", protect, getDevices)
router.get("/:id", protect, getDevice)
router.delete("/:id", protect, isAdmin, deleteDevice)


module.exports = router