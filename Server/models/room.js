const { mongoose } = require("../db")

const Room = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        addedUsers: {
            type: Array,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("room", Room)