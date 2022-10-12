const express = require('express')
const router = express.Router()
const model = require("../models/userArticles")
const validator = require("../middlewares/homePageValidator")
router.get("/", validator, async(req, res) => {
    const len = await model.countDocuments()
    var size = len / 10;
    if (len % 10 != 0)
        size++;
    var json_list = await model.find({}).sort({ "unixTime": "desc" }).limit(10).select({ userId: 0 }).lean()
    res.status(200).render("./homePage.ejs", { json_list: json_list, signedState: req.isLoggedIn, name: req.userName, size: size, current: 1, search: false })
})
router.get("/page/:page", validator, async(req, res) => {
    const page = req.params.page
    if (page == "1" || isNaN(page))
        res.status(200).redirect("/")
    else if (parseInt(page, 10) <= 0) {
        res.status(200).redirect("/")
    } else {
        const len = await model.countDocuments()
        var size = len / 10;
        if (len % 10 != 0)
            size++;
        if ((page - 1) * 10 < len) {
            var json_list = await model.find({}).skip((page - 1) * 10).sort({ "unixTime": "desc" }).limit(10).select({ userId: 0 }).lean()
            res.status(200).render("./homePage.ejs", { json_list: json_list, signedState: req.isLoggedIn, name: req.userName, size: size, current: page, search: false })
        } else {
            res.status(200).redirect("/")
        }
    }
})


module.exports = router