import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Bell, Check, CheckCircle2 } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useSearch } from './SearchContext';
import { useGetNotificationsQuery, useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation } from '@/features/api/absenceApi';

export default function AppLayout({ title, children, actions }) {
  const user = useSelector((state) => state.auth?.user);
  
  // Search
  const { searchQuery, setSearchQuery } = useSearch();

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  
  const { data: notifData } = useGetNotificationsQuery(undefined, { pollingInterval: 30000 });
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unread_count || 0;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id).unwrap();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour de la notification.');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
      toast.success('Toutes les notifications lues.');
      setShowNotifications(false);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

            {/* Bell & Dropdown container */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ position: 'relative', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: '16px',
                      height: '16px',
                      background: 'var(--error)',
                      borderRadius: '50%',
                      border: '2px solid white',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Panel */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '320px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '400px'
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} /> Tout lire
                      </button>
                    )}
                  </div>
                  
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Aucune notification.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => !n.read_at && handleMarkRead(n.id)}
                          style={{ 
                            padding: '12px 16px', 
                            borderBottom: '1px solid var(--border)', 
                            background: n.read_at ? 'transparent' : 'var(--primary-light)',
                            cursor: n.read_at ? 'default' : 'pointer',
                            display: 'flex',
                            gap: '12px'
                          }}
                        >
                          <div style={{ color: n.read_at ? 'var(--text-light)' : 'var(--primary)', paddingTop: '2px' }}>
                            <Bell size={16} />
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: n.read_at ? 400 : 500, lineHeight: 1.4 }}>
                              {n.data.message}
                            </p>
                            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                              {new Date(n.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
