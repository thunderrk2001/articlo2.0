const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const model = require("../models/pending")
const validator = require("../middlewares/validator")
router.post("/post_data", validator, async(req, res) => {
    await addData(req.userDataId, req.body.data, req.body.title, req.userName)
    res.send({
        "message": "sucess"
    })
})
async function addData(id, data, title, name) {
    let d = new Date()
    let date = formatDate(d)
    const json_data = await model({
        "title": title,
        "article": data,
        "userId": id,
        "dateTime": date,
        "userName": name,
        "unixTime": d,
        "isForUpdate": false
    }).save()
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  ";
}


module.exports = router