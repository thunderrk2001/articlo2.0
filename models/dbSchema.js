const mongo = require("mongoose")
const model = mongo.model("Student", {
    userName: {
        type: String,
        required: true,
        unique: true,
        minLength: 4

    },
    password: {
        type: String,
        required: true,

    },
    userDataId: {
        type: String,
        required: true
    },

})
module.exports = model