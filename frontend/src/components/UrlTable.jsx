// Table/list of the user's shortened URLs with actions

import { Link } from 'react-router-dom';
import { FiCopy, FiBarChart2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function UrlTable({ urls, onDelete }) {
  function handleCopy(shortUrl) {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied to clipboard!');
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (urls.length === 0) {
    return (
      <div className="card premium-hover p-10 text-center fade-in-up">
        <p className="font-display font-semibold text-lg text-ink mb-1">No links yet</p>
        <p className="text-muted text-sm font-body">
          Paste a URL above and hit Shorten to create your first link.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden fade-in-up">
      {/* --- Desktop table --- */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="text-left text-xs font-display font-semibold text-muted uppercase tracking-wide border-b border-line bg-white/50">
            <th className="px-5 py-3">Original URL</th>
            <th className="px-5 py-3">Short URL</th>
            <th className="px-5 py-3">Created</th>
            <th className="px-5 py-3">Clicks</th>
            <th className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url, index) => (
            <tr
              key={url.id}
              className="border-b border-line last:border-0 hover:bg-white/65 transition-all duration-200 fade-in-up"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <td className="px-5 py-4 max-w-xs">
                <p className="truncate text-sm text-ink font-body" title={url.originalUrl}>
                  {url.originalUrl}
                </p>
              </td>
              <td className="px-5 py-4">
                <a
                  href={url.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="short-code-pill inline-flex items-center gap-1.5 hover:bg-coral hover:text-ink hover:-translate-y-0.5 transition-all"
                >
                  /{url.shortCode}
                  <FiExternalLink size={12} />
                </a>
              </td>
              <td className="px-5 py-4 text-sm text-muted font-body">{formatDate(url.createdAt)}</td>
              <td className="px-5 py-4 text-sm font-display font-semibold text-ink">{url.clickCount}</td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleCopy(url.shortUrl)}
                    title="Copy link"
                    className="icon-button hover:border-coral hover:text-coral"
                  >
                    <FiCopy size={15} />
                  </button>
                  <Link
                    to={`/analytics/${url.id}`}
                    title="View analytics"
                    className="icon-button hover:border-teal hover:text-teal"
                  >
                    <FiBarChart2 size={15} />
                  </Link>
                  <button
                    onClick={() => onDelete(url.id)}
                    title="Delete"
                    className="icon-button hover:border-red-400 hover:text-red-500"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Mobile cards --- */}
      <div className="md:hidden divide-y divide-line">
        {urls.map((url, index) => (
          <div key={url.id} className="p-4 bg-white/35 fade-in-up" style={{ animationDelay: `${index * 55}ms` }}>
            <p className="truncate text-sm text-ink font-body mb-2" title={url.originalUrl}>
              {url.originalUrl}
            </p>
            <div className="flex items-center justify-between mb-3">
              <a
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="short-code-pill inline-flex items-center gap-1.5"
              >
                /{url.shortCode}
                <FiExternalLink size={12} />
              </a>
              <span className="text-sm font-display font-semibold text-ink">
                {url.clickCount} clicks
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-body">{formatDate(url.createdAt)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(url.shortUrl)}
                  className="icon-button hover:border-coral hover:text-coral"
                >
                  <FiCopy size={15} />
                </button>
                <Link
                  to={`/analytics/${url.id}`}
                  className="icon-button hover:border-teal hover:text-teal"
                >
                  <FiBarChart2 size={15} />
                </Link>
                <button
                  onClick={() => onDelete(url.id)}
                  className="icon-button hover:border-red-400 hover:text-red-500"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
