
// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();            // clear user from App state
    navigate('/login');    // redirect to login
  };

  return (
    <nav style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
      <Link to="/" style={{ fontWeight: 'bold' }}>ChatApp</Link>
      
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Hello, {user?.username ?? 'User'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
