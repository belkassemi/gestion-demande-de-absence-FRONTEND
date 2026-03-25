import React from 'react';
import Sidebar from './Sidebar';
import { Search, Bell } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { useSelector } from 'react-redux';

export default function AppLayout({ title, children, actions }) {
  const user = useSelector((state) => state.auth?.user);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <header
          className="topbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            borderBottom: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          {/* Left: page title */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h1>
          </div>

          {/* Right: search + bell + user */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--surface-alt)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '0.4rem 0.9rem',
                gap: '0.5rem',
              }}
            >
              <Search size={15} style={{ color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Rechercher..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  width: '160px',
                }}
              />
            </div>

            {/* Bell */}
            <button
              style={{ position: 'relative', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
            >
              <Bell size={20} />
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: '8px',
                  height: '8px',
                  background: 'var(--error)',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
            </button>

            {/* Divider */}
            <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

            {/* Extra actions (passed by parent page) */}
            {actions && <div style={{ display: 'flex', alignItems: 'center' }}>{actions}</div>}

            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <div style={{ lineHeight: 1.3 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {user?.name || 'Utilisateur'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: 0, textTransform: 'capitalize' }}>
                  {user?.role || ''}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="page animate-in" style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Global toast notifications */}
      <Toaster richColors position="top-right" />
    </div>
  );
}
