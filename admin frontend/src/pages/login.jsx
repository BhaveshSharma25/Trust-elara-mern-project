import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './login.module.css';
import InputField from '../components/inputfield';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      // Connecting to your updated bcrypt secure backend endpoint
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      if (response.data.success) {
        // 3. This will now redirect smoothly to the dashboard route
        navigate('/practice1');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to connect to authentication server.');
      }
    }
  };

  return (
    <div className={styles.loginPageWrapper}>
      <div className={styles.topBackground}></div>

      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logoPlaceholder}>
            <div className="logo">
              <img src="/images/health-serve-logo.png" alt="logo" height="85px" />
            </div>
          </div>
        </div>

        <div className={styles.loginCard}>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{errorMessage}</p>}

            <InputField
              id="email"
              type="email"
              label="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              id="password"
              type="password"
              label="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className={styles.forgotPasswordContainer}>
              <a href="#forgot" className={styles.forgotPassword}>Forgot Password?</a>
            </div>

            <button type="submit" className={styles.btnAuthenticate}>
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;