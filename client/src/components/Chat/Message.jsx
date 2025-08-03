
import { useAuth } from '../../context/AuthContext';

import './Message.css';

const Message = ({ msg }) => {
  const { user } = useAuth();
  const isOwn = msg.sender?._id === user?._id;

  if (msg.type === 'system') {
    return <div className='message system'>{msg.text}</div>
  }

  return (
    <div className={`message ${isOwn ? 'self' : 'other'}`}>
      <strong>{ isOwn ? 'You' : msg.sender?.username || 'Unknown'}:</strong> {msg.text}
    </div>
  );
};

export default Message;
