
import { useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import SendMessageInput from './SendMessageInput';
import Message from './Message';
import { useAuth } from '../../context/AuthContext';

const ChatBox = ({ selectedChat, messages, message, setMessage, onSendMessage }) => {
  const socket = useSocket();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth'});
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat || !user) return;
    socket.emit('joinChat', { chatId: selectedChat._id, user: { _id: user._id, username: user.username}});
  }, [selectedChat, user, socket]);

  return (
    <div className="chat-box">
      {messages.map((msg, idx) => <Message key={idx} msg={msg} />)}
      
      <div ref={bottomRef} />

      <SendMessageInput 
        chatId={selectedChat?._id}
        message= {message}
        setMessage={setMessage}
        onSend={onSendMessage} 
      />
    </div>
  );
};

export default ChatBox;
