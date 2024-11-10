//src\components\SignUpPage.js
import React, { useState } from 'react';
function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignUp = (e) => {
    e.preventDefault();
    // Add your sign-up logic here
    console.log('Sign Up clicked');
  };
  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}
export default SignUpPage;