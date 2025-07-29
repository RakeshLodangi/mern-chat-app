
// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();            // clear user from App state
    navigate('/login');    // redirect to login
  };

  return (
    <nav className='nav-bar'>
      <Link to="/" className='logo'>ChatApp</Link>
      
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Hello, {user?.username ?? 'User'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className='login-link'>Login</Link>
            <Link to="/register" className='register-link'>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
