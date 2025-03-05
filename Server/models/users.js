const { mongoose } = require("../db")
const isAdmin = require("../middlewares/isAdmin")

const user = mongoose.Schema(
    {
        
            firstName: {
                type: String,
                require: true
            },
            lastName: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: true,
                unique: true
            },
            password: {
                type: String,
                require: true
            },
            isAdmin: {
                type: Boolean,
                default: false
            }
        }
    )

    module.exports = mongoose.model("user", user)
