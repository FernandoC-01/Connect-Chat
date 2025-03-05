import { useState, useEffect, useContext } from 'react'
import { SocketContext } from '../../App';
import "./room.css"

function Rooms({ onRoomSelect }) {
    const [rooms, setRooms] = useState([]);
    const socket = useContext(SocketContext);

    // Fetch rooms on mount
    useEffect(() => {
        const fetchRooms = async () => {
            const response = await fetch("/api/rooms");
            const data = await response.json();
            setRooms(data);
        };
    fetchRooms();
    }, []);

    // Handle room selection
    const handleRoomSelect = (roomId) => {
        socket.emit("joinRoom", { room: roomId, user: "Guest" })
        onRoomSelect(roomId)
    };

    return (
    <div className="room-list">
        <h2>Available Rooms</h2>
        <div className="room-buttons">
            {rooms.map((room) => (
                <button key={room.id} onClick={() => handleRoomSelect(room.id)}>
                    {room.name}
                </button>
            ))}
        </div>
    </div>
    );
}

export default Rooms