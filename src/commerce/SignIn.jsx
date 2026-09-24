import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { api } from './api';
import { useAuth } from './Auth';
import { auth, isEmulator } from '../firebase/config';

export default function SignIn({ admin = false }) {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [mode, setMode] = useState('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const routeUser = (email) => {
    if (email === 'aquasafe.ap@gmail.com') {
      navigate('/admin/dashboard');
    } else {
      navigate('/account');
    }
  };

  async function submitGoogle() {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      try {
        const existing = await api('/me');
        if (!existing || !existing.name) {
          await api('/me', { method: 'PUT', body: JSON.stringify({ name: cred.user.displayName || 'Customer', addresses: existing?.addresses || [] }) });
        }
      } catch (e) {
        // me endpoint creates a user doc if not exists, but we update the name just in case
        await api('/me', { method: 'PUT', body: JSON.stringify({ name: cred.user.displayName || 'Customer', addresses: [] }) });
      }
      
      await refresh();
      routeUser(cred.user.email);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      setBusy(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const f = new FormData(e.currentTarget);
    try {
      if (mode === 'reset') {
        await sendPasswordResetEmail(auth, f.get('email'));
        setNotice('If an account exists, a reset link has been requested.');
        return;
      }
      let cred;
      if (mode === 'register') {
        cred = await createUserWithEmailAndPassword(auth, f.get('email'), f.get('password'));
        await updateProfile(cred.user, { displayName: f.get('name') });
        const existing = await api('/me');
        await api('/me', { method: 'PUT', body: JSON.stringify({ name: f.get('name'), addresses: existing.addresses || [] }) });
        await refresh();
      } else {
        cred = await signInWithEmailAndPassword(auth, f.get('email'), f.get('password'));
      }
      
      routeUser(cred.user.email);
    } catch (err) {
      const credentialsError = ['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(err.code);
      setError(
        credentialsError 
          ? 'The email or password is incorrect. Check your details, or create an account if you are new here.' 
          : err.code === 'auth/too-many-requests' 
            ? 'Too many attempts. Please wait a moment and try again.' 
            : err.message.replace('Firebase: ', '')
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`commerce-auth ${admin ? 'admin-auth' : ''}`}>
      <Link to="/" className="shop-kicker">
        AQUA SAFE WATER TECHNOLOGIES
      </Link>
      <h1>
        {mode === 'register' ? 'Create Account' : mode === 'reset' ? 'Reset Password' : admin ? 'Store Administration' : 'Welcome Back'}
      </h1>
      <p>{isEmulator ? 'Local Firebase demo.' : 'Sign in to access your dashboard.'}</p>
      
      {mode !== 'reset' && (
        <div className="auth-social">
          <button type="button" onClick={submitGoogle} disabled={busy} className="google-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="auth-divider">
            <span>or</span>
          </div>
        </div>
      )}

      <form onSubmit={submit} className="commerce-form">
        {mode === 'register' && (
          <label>
            Full name
            <input name="name" required maxLength={100} autoComplete="name" placeholder="John Doe" />
          </label>
        )}
        <label>
          Email
          <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
        </label>
        {mode !== 'reset' && (
          <label>
            Password
            <input type="password" name="password" minLength={8} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} placeholder="••••••••" required />
          </label>
        )}
        <button className="store-pill" disabled={busy}>
          {busy ? 'Please wait...' : mode === 'register' ? 'Create account' : mode === 'reset' ? 'Request reset link' : 'Sign in with Email'}
        </button>
      </form>

      {error && <p role="alert" className="commerce-error">{error}</p>}
      {notice && <p role="status" className="commerce-notice">{notice}</p>}

      <div className="commerce-inline">
        {!admin && (
          <button type="button" onClick={() => setMode(mode === 'register' ? 'login' : 'register')}>
            {mode === 'register' ? 'Already a customer? Sign in' : 'Create an account'}
          </button>
        )}
        <button type="button" onClick={() => setMode(mode === 'reset' ? 'login' : 'reset')}>
          {mode === 'reset' ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </div>
    </div>
  );
}
