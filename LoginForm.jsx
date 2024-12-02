import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    let isValid = true;

    // Input validation
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: 'Email is required.' }));
      isValid = false;
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: 'Enter a valid email address.' }));
      isValid = false;
    }

    if (!password.trim()) {
      setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
      isValid = false;
    } else if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters with uppercase, number, and special character.',
      }));
      isValid = false;
    }

    if (!isValid) return;

    // API call
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("userName", data.name);
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>
          <UserLoginIcon /> User Login
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {errors.password && <div style={styles.error}>{errors.password}</div>}

        <div style={styles.forgotPasswordContainer}>
          <Link to="/forgot-password" style={styles.forgotPasswordLink}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" style={styles.button}>Login</button>

        <div style={styles.socialContainer}>
          <button style={styles.gmailButton}>
            <GoogleIcon /> Sign Up with Gmail
          </button>
        </div>

        <div style={styles.noAccountText}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </div>
      </form>

      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
};

// Icon Components
const UserLoginIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    viewBox="0 0 24 24"
    style={{ verticalAlign: 'middle', marginRight: '8px' }}
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-4.42 0-8 3.58-8 8v1h16v-1c0-4.42-3.58-8-8-8z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    style={{ marginRight: '8px' }}
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.8-6.8C35.4 2.8 30.2 0 24 0 14.8 0 6.8 5.8 3 14l7.7 6c2-6.2 7.8-10.5 13.3-10.5z"
    />
    <path
      fill="#34A853"
      d="M48 24c0-1.7-.2-3.3-.6-4.9H24v9.3h13.6c-.6 3.5-2.6 6.6-5.6 8.7l7.7 6c4.6-4.3 7.3-10.7 7.3-18.1z"
    />
    <path
      fill="#4A90E2"
      d="M10.6 28.1c-1.3-1.9-2-4.3-2-6.8 0-2.4.7-4.8 2-6.8l-7.7-6C1.6 12.8 0 17.1 0 24c0 6.9 1.7 12.2 4.9 15.6l7.7-6c-2.6-2-4-5-4-8.5z"
    />
    <path
      fill="#FBBC05"
      d="M24 48c6.2 0 11.4-2 15.3-5.5l-7.7-6c-2 1.4-4.5 2.1-7.6 2.1-5.6 0-10.3-3.8-12-8.9l-7.7 6c3.3 6.7 10.4 11.3 18.2 11.3z"
    />
  </svg>
);

// Styles
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    width: '400px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: '600',
    color: '#444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '90%',
    padding: '12px',
    border: '2px solid #ddd',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#333',
    marginBottom: '15px',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#1E90FF',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  gmailButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#FFFFFF',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15px',
  },
  forgotPasswordContainer: {
    marginBottom: '15px',
    textAlign: 'right',
  },
  forgotPasswordLink: {
    fontSize: '14px',
    color: '#1E90FF',
    textDecoration: 'none',
  },
  noAccountText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#555',
  },
  registerLink: {
    color: '#1E90FF',
    textDecoration: 'none',
  },
  message: {
    marginTop: '15px',
    color: 'red',
  },
};

export default LoginForm;
