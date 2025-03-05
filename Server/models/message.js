const { mongoose } = require("../db")

const message = mongoose.Schema(
    {
        when: {
            type: Date,
            require: true
        },
        user: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
        },
        body: {
            type: Array,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("message", message)