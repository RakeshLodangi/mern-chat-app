
import './ChatList.css';

const ChatList = ({ chats, setSelectedChat, selectedChat, currentUser }) => {

  const getOtherUser = (users, currentUserId) => {
    return users.find(user => user._id !== currentUserId);
  };

  return (
    <div className="chat-list">
      <h2>Chats</h2>
      {chats.length === 0 && <p>No chats available</p>}
      {chats.map(chat => { 

        const otherUser = getOtherUser(chat.users, currentUser._id);
        console.log(otherUser);
        return (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
          onClick={() => setSelectedChat(chat)}
        >
          {otherUser.username}
        </div>
      )
      })}
    </div>
  );
}

export default ChatList;
