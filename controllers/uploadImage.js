const express = require("express")
const multer = require("multer")
const model = require("../models/image")
const validator = require("../middlewares/uploadImagevalidator")
const router = express.Router()
const { storage } = require("../models/cloudinary/cloudinaryFile")
const upload = multer({ storage })
router.post("/uploadImage", validator, upload.single("image"), async(req, res) => {
    await model({ "image_url": req.file.path, "userDataId": req.userDataId, "unixTime": Date() }).save()
    res.status(200).send({ "message": "success", "url": req.file.path })
})
module.exports = router