// Form for submitting a long URL to be shortened

import { useState } from 'react';
import { FiArrowRight, FiLink, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createShortUrl } from '../services/api';

export default function UrlForm({ onUrlCreated }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function validateUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmed = originalUrl.trim();

    if (!trimmed) {
      setError('Please enter a URL to shorten.');
      return;
    }

    if (!validateUrl(trimmed)) {
      setError('Enter a full URL starting with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      const response = await createShortUrl(trimmed);
      onUrlCreated(response.data.url);
      setOriginalUrl('');
      toast.success('Short link created!');
    } catch (err) {
      const message = err.response?.data?.message || 'Could not create short link. Try again.';
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card premium-hover p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-coral to-ink" />
      <label htmlFor="originalUrl" className="flex items-center gap-2 font-display font-semibold text-ink mb-3">
        <span className="inline-flex rounded-lg bg-teal/15 p-2 text-teal">
          <FiLink size={16} />
        </span>
        Paste a long URL
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="originalUrl"
          type="text"
          placeholder="https://example.com/your/very/long/link"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="input-field flex-1 h-12"
          disabled={submitting}
        />
        <button type="submit" className="btn-primary flex h-12 items-center justify-center gap-2 whitespace-nowrap" disabled={submitting}>
          {submitting ? (
            <FiLoader className="animate-spin" size={18} />
          ) : (
            <>
              Shorten <FiArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      {error && <p className="text-coral text-sm mt-3 font-body">{error}</p>}
    </form>
  );
}
