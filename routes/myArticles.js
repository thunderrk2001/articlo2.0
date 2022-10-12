const express = require("express")
const router = express.Router()
const model = require("../models/userArticles")
const pendingModel = require("../models/pending")
const rejectModel = require("../models/rejectModel")
const validator = require("../middlewares/myArticlesMiddleware")
router.get("/myArticles", validator, async(req, res) => {
    res.status(200).render("./myArticles.ejs", { userName: req.userName })
})
router.get("/myArticles/articles", validator, async(req, res) => {
    const json_list = await model.find({ userId: req.userDataId }).sort({ "unixTime": "desc" }).lean().select({ userId: 0 })
    res.status(200).send({ "message": "success", "articles": json_list })
})
router.get("/myArticles/pending", validator, async(req, res) => {
    const json_list = await pendingModel.find({ userId: req.userDataId }).sort({ "unixTime": "desc" }).lean().select({ userId: 0 })
    res.status(200).send({ "message": "success", "articles": json_list })
})
router.get("/myArticles/pending/:id", validator, async(req, res) => {
    try {

        const json_obj = await pendingModel.findOne({ _id: req.params.id }).select({ "article": 1, "title": 1, "userName": 1, "dateTime": 1, _id: 0 }).lean()
        if (json_obj == null)
            throw "Null Error"
        res.status(200).render("./previewArticle.ejs", { json_res: json_obj })
    } catch (e) {
        res.status(404).render("./errorView.ejs", { error: "Article don't exists" })
    }
})
router.get("/myArticles/reject", validator, async(req, res) => {
    const json_list = await rejectModel.find({ userId: req.userDataId, isForUpdate: false }).sort({ "unixTime": "desc" }).lean()
    res.status(200).send({ "message": "success", "articles": json_list })
})

router.get("/myArticles/reject_update", validator, async(req, res) => {
    const json_list = await rejectModel.find({ userId: req.userDataId, isForUpdate: true }).sort({ "unixTime": "desc" }).lean()
    res.status(200).send({ "message": "success", "articles": json_list })
})

router.get("/myArticles/editReject/:id", validator, async(req, res) => {
    try {
        const json_data = await rejectModel.findOne({ userId: req.userDataId, _id: req.params.id }).select({
            "title": 1,
            "article": 1,
            "dateTime": 1,
            "message": 1,
            _id: 0
        }).lean()
        if (json_data == null)
            throw "Null Error"
        res.status(200).render("./editReject.ejs", { name: req.userName, id: req.params.id, data: json_data })
    } catch (e) {
        res.status(404).render("./errorView.ejs", { error: "Article don't exists" })
    }
})

router.get("/myArticles/editRejectUpdate/:id", validator, async(req, res) => {
    try {
        const json_data = await rejectModel.findOne({ userId: req.userDataId, _id: req.params.id, isForUpdate: true }).select({
            "title": 1,
            "article": 1,
            "dateTime": 1,
            "message": 1,
            "uid": 1,
            _id: 0
        }).lean()
        if (json_data == null)
            throw "NULL ERROR"
        res.status(200).render("./update.ejs", { name: req.userName, id: json_data.uid, data: json_data })
    } catch (e) {
        res.status(404).render("./errorView.ejs", { error: "Article don't exists" })
    }
})

router.get("/myArticles/update/:id", validator, async(req, res) => {
    try {
        const json_data = await model.findOne({ userId: req.userDataId, _id: req.params.id }).select({
            "title": 1,
            "article": 1,
            "dateTime": 1,
            "message": 1,
            _id: 0
        }).lean()
        if (json_data == null)
            throw "NULL ERROR"
        res.status(200).render("./update.ejs", { name: req.userName, id: req.params.id, data: json_data, })

    } catch (e) {
        res.status(404).render("./errorView.ejs", { error: "Article don't exists" })
    }

})
router.get("/myArticles/editReject/:id/preview", validator, async(req, res) => {

    res.status(200).render("./previewArticleAfterWrite.ejs", { preview: "edit_reject", id: req.params.id })

})
router.post("/myArticles/editReject/:id/submit", validator, async(req, res) => {
    await addData(req.userDataId, req.body.data, req.body.title, req.userName)
    res.send({
        "message": "sucess"
    })
    await rejectModel.findByIdAndDelete(req.params.id)

})

router.post("/myArticles/update/:id/submit", validator, async(req, res) => {
    await addUpdatedData(req.userDataId, req.body.data, req.body.title, req.userName, req.params.id)
    res.send({
        "message": "sucess"
    })
    const json_data = await rejectModel.findOne({ "uid": req.params.id })
    if (json_data == null) {
        await rejectModel.findByIdAndDelete(req.params.id)
    } else {

        await rejectModel.deleteOne(json_data)
    }

})
router.post("/myArticles/articles/:id/delete", validator, async(req, res) => {
    var id = req.params.id
    await model.findByIdAndDelete(id)
    const json_data = await rejectModel.findOne({ "uid": req.params.id })
    if (json_data != null)
        await rejectModel.deleteOne(json_data)
    else {
        const json_data2 = await pendingModel.findOne({ "uid": req.params.id })
        if (json_data2 != null) {
            pendingModel.deleteOne(json_data2)
        }
    }

    res.status(200).send({ "message": "deleted" })


})

async function addData(id, data, title, name) {
    let d = new Date()
    let date = formatDate(d)
    const json_data = await pendingModel({
        "title": title,
        "article": data,
        "userId": id,
        "dateTime": date,
        "userName": name,
        "unixTime": Date(),
        "isForUpdate": false
    }).save()
}
async function addUpdatedData(id, data, title, name, uid) {
    let d = new Date()
    let date = formatDate(d)
    const json_data = await pendingModel({
        "title": title,
        "article": data,
        "userId": id,
        "dateTime": date,
        "userName": name,
        "unixTime": Date(),
        "isForUpdate": true,
        "uid": uid
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