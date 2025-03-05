import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../../App";
import "./currentRoom.css"

function CurrentRoom({ roomId, sessionToken, onExit }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socket = useContext(SocketContext);

    // Fetch messages for the selected room
    useEffect(() => {
        // join room
        socket.emit("joinRoom", {room: roomId, user: sessionToken});

        //get messges
        socket.emit("receiveMessage", (message) => {
            setMessages((prevMessages) => [...prevMessages, message])
        })

        return () => {
            socket.off("receiveMessage") // clearing messages
        }
    }, [roomId, socket, sessionToken]);

    // Send a new message
    const handleSend = () => {
        if (newMessage.trim() === "") return;
        
        socket.emit("sendMessage", { room: roomId, user: sessionToken, message: newMessage })
        setNewMessage("") // Clearing input
    };

    return (
    <div className="room">
        <h2>Room: {roomId}</h2>

        {/* Messages */}
        <div className="message-view">
            {messages.map((msg, index) => (
                <div key={index} className="message">
                    <p>
                        <strong>{msg.user}:</strong> {msg.message}
                    </p>
                </div>
            ))}
        </div>

        {/* Input */}
        <div className="message-input">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>

        <button onClick={onExit}>Exit Room</button>
    </div>
    )
}

export default CurrentRoom