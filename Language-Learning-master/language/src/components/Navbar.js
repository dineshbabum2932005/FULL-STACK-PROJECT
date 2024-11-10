// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import AuthModal from './AuthModal';
function AppNavbar({ currentUser, onLogout }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };
  const handleShowSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Language Learning Tool</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {currentUser && (
              <>
                <Nav.Link as={Link} to="/lessons">Lessons</Nav.Link>
                <Nav.Link as={Link} to="/quiz-selection">Quizzes</Nav.Link>
                <Nav.Link as={Link} to="/progress">Progress</Nav.Link>
              </>
            )}
          </Nav>
          <Nav className="ml-auto">
            {currentUser ? (
              <NavDropdown title={currentUser} id="user-dropdown">
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button variant="outline-primary" className="me-2" onClick={handleShowLogin}>
                  Login
                </Button>
                <Button variant="primary" onClick={handleShowSignUp}>
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <AuthModal
        show={showAuthModal}
        handleClose={handleCloseAuthModal}
        mode={authMode}
      />
    </>
  );
}
export default AppNavbar;