import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/signup.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      
      await axios.post('http://127.0.0.1:8000/register/', {
        username: username,
        password: password
      });
      alert('User created successfully. You can now login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed!');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1>Create an Account</h1>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="signup-button">Signup</button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
