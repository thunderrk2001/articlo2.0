const mongo = require("mongoose")
var sch = new mongo.Schema({
    token: {
        type: String,
        required: true,
    }

})
const model = mongo.model("blacklistedAuthTokens", sch)
module.exports = model