// Top navigation bar shown across the app

import { Link, useNavigate } from 'react-router-dom';
import { FiLink, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-paper/75 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="group flex items-center gap-2">
          <span className="bg-ink text-coral rounded-lg p-1.5 shadow-glow transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-105">
            <FiLink size={18} />
          </span>
          <span className="font-display font-bold text-xl tracking-tight text-ink">Snip</span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-muted font-body">
              Hi, <span className="font-medium text-ink">{user?.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-display font-semibold text-ink
                         border border-line bg-white/60 rounded-lg px-3 py-2 hover:border-coral hover:text-coral
                         hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
