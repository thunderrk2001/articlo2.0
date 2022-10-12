const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const images_model = require("../models/image")
const validator = require("../middlewares/createArticleMiddleware")
const model = require("../models/image")
router.get("/writeArticle", validator, async(req, res) => {
    res.cookie("nextPage", "", {
        httpOnly: false,
        secure: false,
    })
    res.status(200).render("./writeArticle.ejs", { name: req.userName })

})
router.get("/writeArticle/userUploadedImages", validator, async(req, res) => {
    const json_list = await model.find({ "userDataId": req.userDataId }).select({ "image_url": 1, _id: 0 }).lean()
    if (json_list.length != 0) {
        let urlList = []
        json_list.forEach((ele) => {
            urlList.push(ele.image_url)
        })
        res.status(200).send({ "message": "success", "urlList": urlList })
    } else {
        res.send({ "message": "Nothing in user`s databse" })
    }

})
module.exports = router