import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setError(null);
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      dispatch(loginSuccess(userCredential.user));
      clearInputs();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(loginSuccess(userCredential.user));
      clearInputs();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      dispatch(loginSuccess(result.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2 className='auth-title'>Login / Signup</h2>
        {error && <p className='auth-error'>{error}</p>}
        {loading ? (
          <p className='auth-loading'>Loading...</p>
        ) : (
          <>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='auth-input'
            />
            <input
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='auth-input'
            />
            <div className='auth-buttons'>
              <button onClick={handleLogin} className='auth-btn auth-btn-login'>
                Login
              </button>
              <button onClick={handleSignup} className='auth-btn auth-btn-signup'>
                Signup
              </button>
            </div>
            <div className='auth-divider'>OR</div>
            <button onClick={handleGoogleLogin} className='auth-btn auth-btn-google'>
              Login with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
