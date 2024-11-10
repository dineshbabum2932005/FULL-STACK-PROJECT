// src\components\AuthModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AuthModal({ show, handleClose, mode }) {
  const isLogin = mode === 'login';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (isLogin) {
      // Handle Login
      if (users[email] && users[email].password === password) {
        // Successful login
        localStorage.setItem('currentUser', email);
        setError('');
        handleClose();
        alert('Login successful!');
        window.location.reload(); // Reload to update App state
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Handle Sign Up
      if (users[email]) {
        setError('User already exists.');
      } else {
        users[email] = { password, progress: 0, quizProgress: {} };
        localStorage.setItem('users', JSON.stringify(users));
        setError('');
        handleClose();
        alert('Sign Up successful! Please log in.');
      }
    }
  };

  const handleModalClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isLogin ? 'Login' : 'Sign Up'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleAuth}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
