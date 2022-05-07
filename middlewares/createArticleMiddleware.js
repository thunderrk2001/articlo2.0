const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/dbSchema")
const blackListModel = require("../models/blacklistTokens")
var validator = (async(req, res, next) => {
    var t = req.cookies.token
    if (t != undefined) {
        let blackListedToken = await blackListModel.findOne({ token: t }).lean()
        if (blackListedToken == null) {
            jwt.verify(t, process.env.bcryptHash, async(e, d) => {
                if (e) {
                    res.cookie("nextPage", "writeArticle", {
                        httpOnly: false,
                        secure: false,
                    })
                    res.redirect("/signUp")
                } else {
                    const user = await model.findOne({ "userDataId": d.token })
                    req.userName = user.userName
                    req.userDataId = d.token
                    next()
                }
            })

        } else {
            res.cookie("nextPage", "writeArticle", {
                httpOnly: false,
                secure: false,
            })
            res.redirect("/signUp")
        }
    } else {
        res.cookie("nextPage", "writeArticle", {
            httpOnly: false,
            secure: false,
        })
        res.redirect("/signUp")

    }
})
module.exports = validator