
import { useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password){
      return setError('All fields required')
    }

    try {
      await API.post('/auth/register', form);
      alert('Registration success')
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type='text' placeholder="Username" onChange={handleChange} />
      <input name="email" type='email' placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Register</button>
      { error && <p>{error}</p>}
    </form>
  );
};

export default Register;
