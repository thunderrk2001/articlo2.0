const express = require("express")
const router = express.Router()
var emailCheck = require('email-validator');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/dbSchema")
router.post("/signUp", async(req, res) => {
    try {
        const userName = req.body.userName
        const password = req.body.password
        let isValid = true
        try {
            isValid = await emailCheck.validate(req.body.userName)

        } catch (e) {

            isValid = false
        }

        if (isValid == false) {
            throw "Email Not Exists"
        }
        const findModel = await model.findOne({ userName: userName }).lean()
        if (findModel == null) {
            await bcrypt.hash(password, 10, async(e, hash) => {
                try {
                    if (e)
                        throw e
                    var userDataId = userName + hash
                    await bcrypt.hash(userName + process.env.secret_key, 10, async(e, res_hash) => {
                        userDataId = res_hash
                        const jsonObject = { userName: userName, password: hash, userDataId: userDataId }
                        const collection = await model(jsonObject).save()
                        var token = jwt.sign({ "token": userDataId }, process.env.bcryptHash);
                        res.status(200).cookie("token", token, {
                            httpOnly: true,

                        })
                        res.send({
                            "message ": "success"
                        })
                        console.log(token)
                    })

                } catch (err) {
                    res.status(400).send({ "message": "error" });

                }
            })
        } else {
            res.status(400).send({ "message": "Invalid credential " })
        }
    } catch (e) {
        res.status(400).send({ "message": e })
        console.log(e);
    }
})
module.exports = router