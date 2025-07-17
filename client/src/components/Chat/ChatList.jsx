
const ChatList = ({ chats, setSelectedChat, selectedChat }) => {
  return (
    <div>
      <h2>Chats</h2>
      {chats.length === 0 && <p>No chats available</p>}
      {chats.map(chat => (
        <div
          key={chat._id}
          className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
          onClick={() => setSelectedChat(chat)}
        >
          {chat.users.map(user => user.username).join(', ')}
        </div>
      ))}
    </div>
  );
}

export default ChatList;
