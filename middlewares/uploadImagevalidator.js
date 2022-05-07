const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
var validator = ((req, res, next) => {
    var t = req.cookies.token
    if (t != undefined) {
        jwt.verify(t, process.env.bcryptHash, (e, d) => {
            if (e) {
                res.status(400).send({ "message": "wrong credentials" })
            } else {
                req.userDataId = d.token
                next()
            }
        })
    } else {
        res.status(400).send({ "message": "user Not signed in/up" })

    }
})
module.exports = validator