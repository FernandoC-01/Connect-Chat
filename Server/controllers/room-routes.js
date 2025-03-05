const router = require("express").Router()

const Room = require("../models/room")
const authenticateUser = require('../middlewares/authenticateUser');
const isAdmin = require('../middlewares/isAdmin');

// see all rooms endpoint
router.get("/", async (req,res) => {
    try {
        const allRooms = await Room.find({})

        res.status(200).json(allRooms)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})
// create room endpoint
router.post("/create", async (req, res) => {
    try {
        const { name, description, addedUsers } = req.body

        if (
            !name ||
            !description ||
            !addedUsers
        ) {
            throw new Error("Please provide all properties")
        }

        const newRoom = new Room({ name, description, addedUsers })

        await newRoom.save()

        res.status(201).json({
            message: `Room created`,
            newRoom
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})
// update room endpoint
router.put("/:id", authenticateUser, isAdmin, async (req, res) => {
    try {
        const { id } = req.params

        const updatedRoom = await Room.findByIdAndUpdate(id, {
            name: req.body.name ?? name,
            description: req.body.description ?? description,
            addedUsers: req.body.addedUsers ?? addedUsers,
        })

        res.status(200).json({
            message: "Modified",
            updatedRoom
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})
// delete room endpoint
router.delete("/:id", authenticateUser, isAdmin, async (req, res) => {
    try {
        const { id } = req.params

        const deletedRoom = await Room.findByIdAndDelete(id)

        if (!deletedRoom) throw new Error('ID not found')

        res.status(200).json({
            message: `${id} removed from the db`,
            deletedRoom
        })

        save(restOf, dbPath)

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: `${err}`
        })
    }
})

module.exports = router