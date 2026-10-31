
import { useState } from 'react';
import './Auth.css';

const API_URL = 'http://127.0.0.1:8000';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (isRegister) {
        response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        const body = new URLSearchParams();
        body.append('username', form.email);
        body.append('password', form.password);

        response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Request failed');
      }

      if (isRegister) {
        setIsRegister(false);
        setForm({ name: '', email: form.email, password: '' });
        setError('Registration successful. Please sign in.');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin?.(data.user);
    } catch (err) {
      setError(err.message || 'Unable to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-logo">B</div>
        <div>
          <h2>brightloop</h2>
          <span>SOFTWARE</span>
        </div>
      </div>

      <div className="auth-card">
        <p className="auth-eyebrow">BRIGHTLOOP WORKSPACE</p>
        <h1>{isRegister ? 'Create your account' : 'Welcome back!'}</h1>
        <p className="auth-subtitle">
          {isRegister
            ? 'Get started with your subscription workspace.'
            : 'Sign in to manage your subscriptions.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </label>
          )}

          <label>
            Email address
            <input
              required
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {error && <p role="alert">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </div>

      <p className="auth-footer">
        © 2026 Brightloop Software. All rights reserved.
      </p>
    </div>
  );
}
