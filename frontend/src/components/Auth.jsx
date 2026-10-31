
import { useState } from 'react';
import './Auth.css';

export default function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI only for now. Backend authentication will be connected later.
    onLogin?.(form);
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
                placeholder="Enter your name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </label>
          )}

          <label>
            Email address
            <input
              required
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </label>

          <button type="submit" className="auth-submit">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setIsRegister(!isRegister)}>
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
