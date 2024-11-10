import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Lessons from './components/Lessons';
import Quiz from './components/Quiz';
import QuizSelection from './components/QuizSelection';
import ProgressBarComponent from './components/ProgressBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="App bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
        <AppNavbar currentUser={currentUser} onLogout={handleLogout} />
        
        {/* Main content area */}
        <div className="flex-grow flex justify-center items-center py-10">
          <div className="container mx-auto px-4">
            <Routes>
              <Route path="/" element={
                <div className="text-center mt-16 p-6 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-xl text-white transition-transform transform hover:scale-105">
                  <h1 className="text-4xl font-semibold">Welcome to the Language Learning Tool</h1>
                  <p className="mt-4 text-xl">Start your language learning journey today!</p>
                </div>
              } />
              <Route path="/lessons" element={
                currentUser ? <Lessons user={currentUser} /> : <Navigate to="/" />
              } />
              <Route path="/quiz-selection" element={
                currentUser ? <QuizSelection /> : <Navigate to="/" />
              } />
              <Route path="/quiz/:language" element={
                currentUser ? <Quiz user={currentUser} /> : <Navigate to="/" />
              } />
              <Route path="/progress" element={
                currentUser ? <ProgressBarComponent user={currentUser} /> : <Navigate to="/" />
              } />
              <Route path="/quiz" element={
                currentUser ? <Navigate to="/quiz-selection" /> : <Navigate to="/" />
              } />
              <Route path="*" element={
                <div className="text-center p-4">
                  <h1 className="text-2xl font-bold text-red-500">404: Page Not Found</h1>
                  <p className="mt-2 text-lg">Oops, this page doesn't exist!</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
