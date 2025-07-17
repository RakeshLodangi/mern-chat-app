
import { useEffect, useState } from 'react';
import API from '../../utils/api';

const UserListModal = ({ onSelect, onClose, currentUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/users', {
          headers: { Authorization: `Bearer ${currentUser.token}` },
        });
        // Filter out the current user
        const filtered = res.data.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Select a user to start chat</h3>
        <button onClick={onClose}>Close</button>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => onSelect(user._id)}
              style={{ cursor: 'pointer', padding: '6px' }}
            >
              {user.username} ({user.email})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserListModal;
