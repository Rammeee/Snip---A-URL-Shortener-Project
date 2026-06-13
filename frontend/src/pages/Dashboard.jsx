// Dashboard page: lists user's URLs and allows creating new ones

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { fetchUrls, deleteShortUrl } from '../services/api';
import UrlForm from '../components/UrlForm';
import UrlTable from '../components/UrlTable';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUrls = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchUrls();
      setUrls(response.data.urls);
    } catch (err) {
      setError('Could not load your links. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUrls();
  }, [loadUrls]);

  function handleUrlCreated(newUrl) {
    setUrls((prev) => [newUrl, ...prev]);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this short link? This cannot be undone.')) return;

    try {
      await deleteShortUrl(id);
      setUrls((prev) => prev.filter((url) => url.id !== id));
      toast.success('Link deleted.');
    } catch (err) {
      toast.error('Could not delete this link. Please try again.');
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-motion">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="fade-in-up">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">Your links</h1>
          <p className="text-muted text-sm mt-1 font-body">
            Create, manage, and track all of your shortened URLs in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:w-64 stagger-children">
          <div className="surface-panel premium-hover px-4 py-3">
            <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted">Links</p>
            <p className="font-display text-2xl font-bold text-ink">{urls.length}</p>
          </div>
          <div className="surface-panel premium-hover px-4 py-3">
            <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted">Clicks</p>
            <p className="font-display text-2xl font-bold text-coral">
              {urls.reduce((total, url) => total + Number(url.clickCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 fade-in-up" style={{ animationDelay: '140ms' }}>
        <UrlForm onUrlCreated={handleUrlCreated} />
      </div>

      {loading ? (
        <div className="card p-10 flex items-center justify-center fade-in-up">
          <div className="h-8 w-8 border-2 border-line border-t-coral rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="card p-6 text-center text-coral font-body fade-in-up">{error}</div>
      ) : (
        <UrlTable urls={urls} onDelete={handleDelete} />
      )}
    </main>
  );
}
