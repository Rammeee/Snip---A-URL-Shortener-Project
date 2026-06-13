// Analytics page: shows summary and recent visits for a single URL

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiCopy } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchUrlAnalytics } from '../services/api';

export default function Analytics() {
  const { id } = useParams();
  const [summary, setSummary] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await fetchUrlAnalytics(id);
        setSummary(response.data.summary);
        setRecentVisits(response.data.recentVisits);
      } catch (err) {
        const message = err.response?.data?.message || 'Could not load analytics for this link.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function handleCopy(shortUrl) {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 fade-in-up">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-display font-semibold text-muted hover:text-ink hover:-translate-x-0.5 mb-6 transition-all">
        <FiArrowLeft size={16} />
        Back to dashboard
      </Link>

      {loading ? (
        <div className="card p-10 flex items-center justify-center">
          <div className="h-8 w-8 border-2 border-line border-t-coral rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card p-6 text-center text-coral font-body">{error}</div>
      ) : (
        <>
          {/* --- Summary card --- */}
          <div className="card p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal via-coral to-ink" />
            <h1 className="font-display font-bold text-2xl text-ink mb-4">Link analytics</h1>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-display font-semibold text-muted uppercase tracking-wide mb-1">Original URL</p>
                <p className="text-sm text-ink font-body break-all">{summary.originalUrl}</p>
              </div>

              <div>
                <p className="text-xs font-display font-semibold text-muted uppercase tracking-wide mb-1">Short URL</p>
                <div className="flex items-center gap-2">
                  <a
                    href={summary.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-code-pill inline-flex items-center gap-1.5 hover:bg-coral hover:text-ink hover:-translate-y-0.5 transition-all"
                  >
                    {summary.shortUrl.replace(/^https?:\/\//, '')}
                    <FiExternalLink size={12} />
                  </a>
                  <button
                    onClick={() => handleCopy(summary.shortUrl)}
                    className="icon-button hover:border-coral hover:text-coral"
                  >
                    <FiCopy size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-line">
                <div className="surface-panel p-4 shadow-none">
                  <p className="text-xs font-display font-semibold text-muted uppercase tracking-wide mb-1">Total Clicks</p>
                  <p className="text-2xl font-display font-bold text-ink">{summary.clickCount}</p>
                </div>
                <div className="surface-panel p-4 shadow-none">
                  <p className="text-xs font-display font-semibold text-muted uppercase tracking-wide mb-1">Created</p>
                  <p className="text-sm text-ink font-body mt-1.5">{formatDateTime(summary.createdAt)}</p>
                </div>
                <div className="surface-panel p-4 shadow-none">
                  <p className="text-xs font-display font-semibold text-muted uppercase tracking-wide mb-1">Last Visited</p>
                  <p className="text-sm text-ink font-body mt-1.5">
                    {summary.lastVisitedAt ? formatDateTime(summary.lastVisitedAt) : 'Not yet visited'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Recent visits --- */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-ink mb-4">Recent visits</h2>
            {recentVisits.length === 0 ? (
              <p className="text-muted text-sm font-body">No visits recorded yet for this link.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentVisits.map((visit) => (
                  <li key={visit.id} className="py-3 text-sm text-ink font-body flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal shadow-glow" />
                    {formatDateTime(visit.visitedAt)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </main>
  );
}
