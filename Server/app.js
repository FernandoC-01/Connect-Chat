require("dotenv").config()
const express = require('express');
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io")
const { dbConnect } = require("./db")
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:4000",
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT;
const HOST = process.env.HOST;

const sessionValidation = require("./middlewares/authenticateUser");
const userRoutes = require('./controllers/user-routes');
const roomRoutes = require('./controllers/room-routes');
const messageRoutes = require('./controllers/messageRoutes');
const { timeStamp } = require("console");
const { Socket } = require("socket.io-client");

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/user-routes', userRoutes);
app.use('/room-routes', roomRoutes, sessionValidation);
app.use('/messagesRoutes', messageRoutes, sessionValidation);

const users = {};
// socket connection
io.on("connection", (socket) => {
    console.log(`[socket] User Connected: ${socket.id}`)

    // user joining room
    socket.on("JoinRoom", async ({ room, user }) => {
        socket.join(room)
        console.log(`[socket] ${user} joined room: ${room}`)

        //Fetching previous messages
        const messages = await MessageChannel.find({room}).sort({ created: 1})
        socket.emit("previousMessages", messages);
    });

    //new message
    socket.on("sendMessage", async ({ room, user, message }) => {
        console.log(`[socket] New message in ${room} from ${user}: ${message}`)

        //save message
        const newMessage = new Message({
            when: new Date(),
            user,
            room,
            body: message,
        });

        await newMessage.save();

        // announce message to all in the room
        io.to(room).emit("receiveMessage", {
            user,
            message,
            timeStamp: new Date()
        });
    });

    //allow discount
    socket.on("disconnect", () => {
        console.log(`[socket] User disconnected: ${socket.id}`)
    });
});

app.listen(PORT, HOST, async () => {
    await dbConnect(),
    console.log(`[server] listening on ${HOST}:${PORT}`);
});