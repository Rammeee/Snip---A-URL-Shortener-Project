// Login page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLoader, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required.';
    if (!password) newErrors.password = 'Password is required.';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-in-up">
        <div className="text-center mb-8">
          <span className="inline-flex bg-ink text-coral rounded-xl p-3 mb-4 shadow-glow">
            <FiLink size={24} />
          </span>
          <h1 className="font-display font-bold text-2xl text-ink">Welcome back</h1>
          <p className="text-muted text-sm mt-1 font-body">Log in to manage your short links</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral via-teal to-ink" />
          {errors.form && (
            <div className="bg-coral/10 border border-coral/30 text-coral text-sm rounded-lg px-3 py-2 font-body">
              {errors.form}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-display font-semibold text-ink mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field h-11"
              placeholder="you@example.com"
              disabled={submitting}
            />
            {errors.email && <p className="text-coral text-xs mt-1 font-body">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-display font-semibold text-ink mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field h-11"
              placeholder="••••••••"
              disabled={submitting}
            />
            {errors.password && <p className="text-coral text-xs mt-1 font-body">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={submitting}>
            {submitting ? <FiLoader className="animate-spin" size={18} /> : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6 font-body">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ink font-display font-semibold hover:text-coral">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
