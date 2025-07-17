
import { useState } from 'react';
import API, { setAuthToken } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const socket = useSocket();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/auth/login', form);
      const user = res.data;

      login(user);
      setAuthToken(user.token);

      socket?.emit('login', user);
      alert('login succsess')

    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        name="email" 
        placeholder="Email" 
        onChange={handleChange}
        required
      />

      <input
        type='password'
        name="password"  
        placeholder="Password"
        required 
        onChange={handleChange} 
      />

      <button type="submit" >Login</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
