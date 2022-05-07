const mongo = require("mongoose")
const model = mongo.model("image", {
    image_url: {
        type: String,
        required: true
    },
    userDataId: {
        type: String,
        required: true
    },
    unixTime: {
        type: Date,
        required: true
    }
})
module.exports = model