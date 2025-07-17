
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ChatList from '../components/Chat/ChatList';
import ChatBox from '../components/Chat/ChatBox';
import { useSocket } from '../context/SocketContext';
import UserListModal from '../components/Chat/UserListModal';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const [showUserList, setShowUserList] = useState(false);

  // redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) return navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (!socket || !selectedChat) return;
    
    //console.log('joining the chat', { chatId: selectedChat._id, user: user})
    socket.emit('joinChat', { chatId: selectedChat._id, user: { _id: user._id, username: user.username} });
  }, [socket, selectedChat]);

  //Fetch user chats

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await API.get('/chats', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setChats(res.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
    if (user) fetchChats();
  }, [user]);

  // Fetch messages for the selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const res = await API.get(`/messages/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    if (selectedChat && user) fetchMessages();
  }, [selectedChat, user]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    
    const handleIncoming = (msg) => {
      if (msg.sender?._id === user._id) return;

      if (msg?.chat?._id && msg.chat._id === selectedChat?._id) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      } else {
        console.warn('Received message with no valid chat ID', msg);
      }
    };
    socket.on('message', handleIncoming);
    return () => socket.off('message', handleIncoming);
  }, [socket, selectedChat]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    if (!user || !user.token || !selectedChat || !selectedChat._id) {
      console.error('User or chat not selected');
      return;
    }

    try {
      const res = await API.post(
        '/messages',
        { chatId: selectedChat._id, text: text },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const messageToSend = {
        ...res.data,
        chat: { _id: selectedChat._id},
        sender: {
          _id: user._id,
          username: user.username,
        }
      }

      setMessages((prev) => [...prev, messageToSend]);
      socket.emit('sendMessage', messageToSend);
      setMessage('');

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startNewChat = async (userId) => {
    try {
      const res = await API.post(
        '/chats',
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const exists = chats.find(chat => chat._id === res.data._id);
      if (!exists) {
        setChats((prevChats) => [...prevChats, res.data]);
      }
      setSelectedChat(res.data);
      setShowUserList(false);
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  return (
    <div className="chat-page">
      {showUserList && (
        <UserListModal 
          onSelect={startNewChat} 
          onClose={() => setShowUserList(false)} 
          currentUser={user} 
        />
      )}

      <div className='chat-list'>
        <button
          className='start-chat-btn'
          onClick={() => setShowUserList(true)}
        >
          + Start New Chat
        </button>

        <ChatList chats={chats} setSelectedChat={setSelectedChat} />

      </div>

      <div className="chat-box">
          <ChatBox 
            selectedChat={selectedChat}
              messages = {messages}
              message = {message}
              setMessage = {setMessage}
            onSendMessage = {handleSendMessage}
          />
      </div>
      

    </div>
  );
};

export default Chat;
