// Signup page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLoader, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) newErrors.email = 'Enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signup(name.trim(), email.trim(), password);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Signup failed. Please try again.';
      setErrors({ form: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md page-motion">
        <div className="text-center mb-8 stagger-children">
          <span className="inline-flex bg-ink text-coral rounded-xl p-3 mb-4 shadow-glow float-subtle">
            <FiLink size={24} />
          </span>
          <h1 className="font-display font-bold text-2xl text-ink">Create your account</h1>
          <p className="text-muted text-sm mt-1 font-body">Start shortening and tracking links in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="card premium-hover p-6 space-y-4 relative overflow-hidden fade-in-up" style={{ animationDelay: '120ms' }}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-coral to-ink" />
          {errors.form && (
            <div className="bg-coral/10 border border-coral/30 text-coral text-sm rounded-lg px-3 py-2 font-body">
              {errors.form}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-display font-semibold text-ink mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field h-11"
              placeholder="Jane Doe"
              disabled={submitting}
            />
            {errors.name && <p className="text-coral text-xs mt-1 font-body">{errors.name}</p>}
          </div>

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
              placeholder="At least 6 characters"
              disabled={submitting}
            />
            {errors.password && <p className="text-coral text-xs mt-1 font-body">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={submitting}>
            {submitting ? <FiLoader className="animate-spin" size={18} /> : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-ink font-display font-semibold hover:text-coral">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
