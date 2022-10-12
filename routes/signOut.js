const express = require("express")
const router = express.Router()
const validator = require("../middlewares/signOutChecker")
const blackListModel = require("../models/blacklistTokens")
router.get("/signOut", validator, async(req, res) => {
    const blackListedToken = await blackListModel({ token: req.cookies.token }).save()
    res.status(200).cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    })
    res.status(200).redirect("/")
})
module.exports = router