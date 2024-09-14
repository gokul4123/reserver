import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate(); // Use the useNavigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/auctions'); // Redirect to the auctions page on successful login
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      await updateProfile(newUser, { displayName: fullName });
      setUser(newUser);
      navigate('/auctions'); // Redirect to the auctions page on successful sign-up
    } catch (err) {
      setError(err.message);
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="total">
      <div className="form-container">
        {user ? (
          <div className="welcome-message">
            <h2>Welcome, {user.displayName || 'User'}!</h2>
            <button onClick={handleLogout} className="btn logout-btn">Logout</button>
          </div>
        ) : (
          <>
            <div className="form-toggle">
              <span
                onClick={() => setIsSignUp(false)}
                className={!isSignUp ? 'active' : ''}
              >
                Log In
              </span>
              <span
                onClick={() => setIsSignUp(true)}
                className={isSignUp ? 'active' : ''}
              >
                Sign Up
              </span>
            </div>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="form-content">
              {isSignUp && (
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn" disabled={loading}>
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Log In'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
