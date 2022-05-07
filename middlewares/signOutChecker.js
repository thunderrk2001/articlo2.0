const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const blackListModel = require("../models/blacklistTokens")
var validator = (async(req, res, next) => {
    var t = req.cookies.token
    if (t != undefined) {
        let blackListedToken = await blackListModel.findOne({ token: t }).lean()
        if (blackListedToken == null) {
            jwt.verify(t, process.env.bcryptHash, (e, d) => {

                if (e) {
                    res.redirect("/")
                } else {
                    next()
                }
            })
        } else {
            res.redirect("/")


        }
    } else {
        res.redirect("/")


    }
})
module.exports = validator