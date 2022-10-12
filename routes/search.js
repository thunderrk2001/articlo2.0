const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/userArticles")
const validator = require("../middlewares/homePageValidator")
router.post("/search", async(req, res) => {
    const title = req.body.title

    const json_list = await model.find({ $text: { $search: title } }).limit(10).lean().select({ _id: 1, title: 1 })

    res.status(200).send(json_list)
})
router.get("/search/display/", validator, async(req, res) => {
    const title = req.query.title
    const page = req.query.page
    const len = await model.countDocuments()
    var size = len / 10;
    var json_list = []
    if (len % 10 != 0)
        size++;
    if (page == undefined) {
        json_list = await model.find({ $text: { $search: title } }).sort({ "unixTime": "desc" }).limit(10).select({ "userId": 0 }).lean()

    } else if (page <= size) {
        json_list = await model.find({ $text: { $search: title } }).skip((page - 1) * 10).sort({ "unixTime": "desc" }).limit(10).select({ "userId": 0 }).lean()

    }

    res.status(200).render("./homePage.ejs", { json_list: json_list, signedState: req.isLoggedIn, name: req.userName, size: size, current: 1, search: true, query: title })
})

module.exports = router