import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { GoogleAuthProvider, getRedirectResult, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { ShieldCheck, UserRound } from 'lucide-react';
import { api } from './api';
import { useAuth } from './Auth';
import { auth, isEmulator } from '../firebase/config';

// Share the result across React StrictMode's effect setup/cleanup cycle.
let localRedirectResult;
let localRedirectHandled = false;

const googleErrors = {
  'auth/popup-blocked': 'Allow pop-ups for this website, then select Continue with Google again.',
  'auth/unauthorized-domain': 'Google sign-in is not configured for this website address. Please contact support.',
  'auth/operation-not-allowed': 'Google sign-in has not been enabled for this store yet. Please contact support.',
  'auth/network-request-failed': 'Unable to connect to Google sign-in. Check your connection and try again.',
  'auth/account-exists-with-different-credential': 'This email belongs to an existing account that needs to be linked to Google. Please contact support to keep your orders.',
  'auth/user-disabled': 'This account is disabled. Please contact support.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
};

export default function SignIn({ admin = false }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next');
  const { refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const Icon = admin ? ShieldCheck : UserRound;

  const finishSignIn = useCallback(async (user) => {
    const existing = await api('/me');
    if (!existing.name && user.displayName) {
      await api('/me', { method: 'PUT', body: JSON.stringify({ name: user.displayName, addresses: existing.addresses || [] }) });
    }
    const profile = await refresh();
    if (!profile) throw new Error('Please continue with Google to sign in again.');
    if (admin && !profile.admin) throw new Error('This Google account does not have administrator access. Choose another account or open your customer account.');
    navigate(!admin && next === '/checkout' ? '/checkout' : profile.admin ? '/admin/dashboard' : '/account', { replace: true });
  }, [admin, next, navigate, refresh]);

  useEffect(() => {
    if (!isEmulator) return;
    let active = true;
    localRedirectResult ||= getRedirectResult(auth);
    localRedirectResult.then(async result => {
      if (!active || !result || localRedirectHandled) return;
      localRedirectHandled = true;
      setBusy(true);
      await finishSignIn(result.user);
    }).catch(err => {
      if (active) setError(googleErrors[err.code] || (err.code?.startsWith('auth/') ? 'Google sign-in could not be completed. Please try again.' : err.message));
    }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [finishSignIn]);

  async function submitGoogle() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      if (isEmulator) {
        await signInWithRedirect(auth, provider);
        return;
      }
      const { user } = await signInWithPopup(auth, provider);
      await finishSignIn(user);
    } catch (err) {
      if (!['auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(err.code)) {
        setError(googleErrors[err.code] || (err.code?.startsWith('auth/') ? 'Google sign-in could not be completed. Please try again.' : err.message));
      }
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  return (
    <section className={`commerce-auth google-auth ${admin ? 'admin-auth' : ''}`} aria-labelledby="signin-heading">
      <Link to="/" className="shop-kicker">AQUA SAFE WATER TECHNOLOGIES</Link>
      <span className="auth-account-icon" aria-hidden="true"><Icon size={28} strokeWidth={1.6} /></span>
      <h1 id="signin-heading">{admin ? 'Store administration' : 'Your account, simplified.'}</h1>
      <p className="auth-intro">{admin ? 'Continue with your authorized Google account to manage your store.' : 'Track orders, save your addresses and manage your purchases with one account.'}</p>
      <button type="button" onClick={submitGoogle} disabled={busy} aria-busy={busy} className="google-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {busy ? 'Signing in…' : 'Continue with Google'}
      </button>
      {error && <p role="alert" className="commerce-error">{error}</p>}
      {!admin && <p className="auth-first-visit">New here? Your account is created on your first Google sign-in.</p>}
      {isEmulator && <p className="auth-preview-note">Local preview uses simulated Google accounts.</p>}
      <div className="auth-footer-links">
        <Link to={admin ? '/account' : '/products'}>{admin ? 'Open customer account' : 'Continue shopping'}</Link>
        <Link to="/contact">Need help?</Link>
      </div>
    </section>
  );
}
