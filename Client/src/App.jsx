import { useState, useEffect, createContext } from 'react'
import { io } from "socket.io-client"
import './App.css'
import Auth from './components/Auth/Auth'
import Rooms from './components/Rooms/Rooms'
import CurrentRoom from './components/CurrentRoom/CurrentRoom'

export const SocketContext = createContext();

const socket = io("http://127.0.0.1:4000");

function App() {

  const [selectedRoomId, setSelectedRoomId] = useState(undefined);
  const [sessionToken, setSessionToken] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false); 


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setSessionToken(token);
      setIsAdmin(localStorage.getItem("isAdmin") === "true"); 
    }
  }, []);

  // Update token and admin status in localStorage
  const updateLocalStorage = (newToken, adminStatus = false) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("isAdmin", adminStatus);
    setSessionToken(newToken);
    setIsAdmin(adminStatus);
  };

  const deleteToken = () => {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token")
      localStorage.removeItem("isAdmin");
      setSessionToken(undefined)
      setSelectedRoomId(undefined);
      setIsAdmin(false);
    }
  }

  // const showLogoutBtn = () => !sessionToken ? null : (
  //   <button onClick={deleteToken}>Logout</button>
  // )

  
  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
  };

  const handleRoomExit = () => {
    setSelectedRoomId(undefined);
  };

  const handleView = () => {
    return !sessionToken ? (
      <Auth updateLocalStorage={updateLocalStorage} />
    ) : selectedRoomId ? (
      <CurrentRoom
        roomId={selectedRoomId}
        sessionToken={sessionToken}
        onExit={handleRoomExit}
      />
    ) : (
      <Rooms
        onRoomSelect={handleRoomSelect}
        sessionToken={sessionToken}
        isAdmin={isAdmin}
      />
    );
  };
  
  return (
    <SocketContext.Provider value={socket}>
      <>
      {sessionToken && <button onClick={deleteToken}>Logout</button>}
        {handleView()}
      </>
    </SocketContext.Provider>
  )
}

export default App
