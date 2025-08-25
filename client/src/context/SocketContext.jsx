
import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io( process.env.REACT_APP_API_URL , {
      auth: {
        token: user?.token,
      }
    });
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  if (!socket)  return null;

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
