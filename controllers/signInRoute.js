const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/dbSchema")
router.post("/signIn", async(req, res) => {
    try {
        const userName = req.body.userName
        const password = req.body.password
        if (userName == undefined || password == undefined)
            throw "field cant be empty"
        const findModel = await model.findOne({ userName: userName }).lean()
        if (findModel == null) {
            throw "User Name not exist"
        } else {
            var compare_result = await bcrypt.compare(password, findModel.password)
            if (compare_result) {
                var cp = JSON.parse(JSON.stringify(findModel))
                var token = await jwt.sign({ "token": cp.userDataId }, process.env.bcryptHash)
                res.status(200).cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict"
                })

                res.status(200).send({ "message": "sucessfull signed In" })
            } else {
                res.status(400).send({ "message": "password not matched" })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(400).send({ "message": e })

    }

})
module.exports = router