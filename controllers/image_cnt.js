const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/image")
router.post("/post_image", async(req, res) => {
    const json_data = await model({
        "image_data": req.body.data
    }).save()
    if (json_data != undefined && json_data != null) {
        const id = json_data._id
        var path_image = "/post_image/"
        path_image += id
        res.status(200).send({
            "message": "success",
            "uid": id
        })
    } else {
        res.status(400).send({
            "message": "faliure",

        })
    }

})

module.exports = router