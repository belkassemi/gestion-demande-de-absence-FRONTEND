import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Menu, X } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useSelector } from 'react-redux';

export default function AppLayout({ title, children, actions }) {
  const user = useSelector((state) => state.auth?.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="layout" style={{ position: 'relative' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 90,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div style={{
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 100,
        width: '260px',
      }}>
        <Sidebar onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      </div>

      {/* Main content */}
      <div
        className="main-content"
        style={{ marginLeft: isMobile ? 0 : '260px', transition: 'margin-left 0.3s ease' }}
      >
        <header
          className="topbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Left: hamburger (mobile) + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-primary)', display: 'flex',
                  alignItems: 'center', padding: '4px',
                }}
              >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            )}
            <h1 style={{
              fontSize: isMobile ? '1rem' : '1.05rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: isMobile ? '140px' : 'none',
            }}>
              {title}
            </h1>
          </div>

          {/* Right: search + bell + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.5rem' : '1rem' }}>

            {/* Search — hidden on small mobile */}
            {!isMobile && (
              <div style={{
                display: 'flex', alignItems: 'center',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '0.4rem 0.9rem', gap: '0.5rem',
              }}>
                <Search size={15} style={{ color: 'var(--text-light)' }} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '14px', color: 'var(--text-primary)', width: '160px',
                  }}
                />
              </div>
            )}

            {/* Bell */}
            <button style={{
              position: 'relative', color: 'var(--text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: 2, right: 2,
                width: '8px', height: '8px',
                background: 'var(--error)', borderRadius: '50%',
                border: '2px solid white',
              }} />
            </button>

            {/* Divider */}
            {!isMobile && <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />}

            {/* Extra actions */}
            {actions && <div style={{ display: 'flex', alignItems: 'center' }}>{actions}</div>}

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {initials}
              </div>
              {!isMobile && (
                <div style={{ lineHeight: 1.3 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                    {user?.name || 'Utilisateur'}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, textTransform: 'capitalize' }}>
                    {user?.role || ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main
          className="page animate-in"
          style={{
            padding: isMobile ? '1rem' : '2rem',
            maxWidth: '1600px',
            margin: '0 auto',
          }}
        >
          {children}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
