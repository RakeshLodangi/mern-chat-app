
import './SendMessageInput.css';

const SendMessageInput = ({ chatId, message, setMessage, onSend }) => {

  const sendMessage = () => {
    if (!message.trim() || !chatId) return;
    onSend(message);
    setMessage('');
  };

  return (
    <div className="send-message">
      <input
        type="text" 
        value={message} 
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder='Type a message...'
      />
      <button 
        onClick={sendMessage}
        disabled={!chatId || !message.trim()}
      >
        Send
      </button>
    </div>
  );
};

export default SendMessageInput;
