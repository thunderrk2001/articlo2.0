const mongo = require("mongoose")
mongo.set('useCreateIndex', true)
var sch = new mongo.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    article: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    unixTime: {
        type: Date,
        required: true
    }

})
sch.index({ title: "text" })
const model = mongo.model("userArticles", sch)
module.exports = model