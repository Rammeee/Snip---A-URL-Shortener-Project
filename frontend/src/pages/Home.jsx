// Landing page for unauthenticated visitors

import { Link } from 'react-router-dom';
import { FiLink, FiArrowRight, FiBarChart2, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 page-motion">
      <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
        <div className="stagger-children text-center lg:text-left">
          <span className="inline-flex items-center gap-2 bg-white/70 border border-white/80 text-ink rounded-full px-3 py-1.5 mb-6 shadow-soft">
            <FiLink className="text-coral" size={16} />
            <span className="text-xs font-display font-semibold uppercase tracking-wide">Elegant link control</span>
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-6xl text-ink leading-tight mb-5">
            Shorten links. See what happens next.
          </h1>
          <p className="text-muted text-base sm:text-lg font-body max-w-xl mx-auto lg:mx-0 mb-8">
            Snip turns long, messy URLs into sharp, shareable links with clean analytics built for quick decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <Link to="/signup" className="btn-primary flex items-center gap-2">
              Get started <FiArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Log in
            </Link>
          </div>
        </div>

        <div className="fade-in-up surface-panel premium-hover float-subtle p-4 sm:p-6" style={{ animationDelay: '160ms' }}>
          <div className="rounded-xl bg-ink p-4 sm:p-5 text-paper shadow-soft">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display font-semibold">snip.link/campaign</span>
              <span className="h-2.5 w-2.5 rounded-full bg-teal shadow-glow pulse-dot" />
            </div>
            <div className="space-y-3">
              <div className="h-3 rounded-full bg-white/20 w-11/12 shine-line" />
              <div className="h-3 rounded-full bg-white/10 w-7/12 shine-line" />
              <div className="grid grid-cols-3 gap-3 pt-5">
                <div className="rounded-lg bg-white/10 p-3 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-xs text-paper/60">Clicks</p>
                  <p className="font-display text-2xl font-bold text-teal">842</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-xs text-paper/60">Today</p>
                  <p className="font-display text-2xl font-bold text-coral">96</p>
                </div>
                <div className="rounded-lg bg-white/10 p-3 transition-transform duration-200 hover:-translate-y-1">
                  <p className="text-xs text-paper/60">Links</p>
                  <p className="font-display text-2xl font-bold">24</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4 text-left pb-12 stagger-children">
        <div className="card premium-hover p-5">
          <span className="inline-flex bg-teal/15 text-teal rounded-lg p-2 mb-3"><FiZap size={18} /></span>
          <h3 className="font-display font-semibold text-ink mb-1">Instant short links</h3>
          <p className="text-sm text-muted font-body">Paste any URL and get a clean, shareable short link in one click.</p>
        </div>
        <div className="card premium-hover p-5">
          <span className="inline-flex bg-coral/15 text-coral rounded-lg p-2 mb-3"><FiBarChart2 size={18} /></span>
          <h3 className="font-display font-semibold text-ink mb-1">Simple analytics</h3>
          <p className="text-sm text-muted font-body">Track total clicks and see your 10 most recent visits at a glance.</p>
        </div>
      </section>
    </main>
  );
}
