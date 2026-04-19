import React, { useState } from 'react';
import './LoginModal.css';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after successful login so parent can update user state */
  onLoginSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: email, Password: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || data || 'Login failed');
      } else {
        setSuccess('Login successful!');
        if (data.Token) {
          localStorage.setItem('token', data.Token);
        }
        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          setTimeout(() => {
            setSuccess(null);
            onClose();
          }, 1200);
        }
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xp-modal-overlay">
      <div className="window xp-login-modal">
        <div className="title-bar">
          <div className="title-bar-text">User Login</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose}></button>
          </div>
        </div>
        <div className="window-body">
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </label>
            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}
            <div className="login-actions">
              <button type="submit" disabled={loading} className="xp-btn-primary">
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <button type="button" onClick={onClose} disabled={loading} className="xp-btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
