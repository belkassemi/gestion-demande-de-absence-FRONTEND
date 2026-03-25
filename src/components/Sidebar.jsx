import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/api/absenceApi';
import {
  LayoutDashboard, List, Plus, Clock, Calendar, History,
  CheckSquare, BarChart2, Building2, Users, FolderOpen,
  LogOut, FileText, ShieldCheck, BookOpen, CalendarDays
} from 'lucide-react';

const NAV_BY_ROLE = {
  employee: [
    { to: '/employee/requests', icon: <List size={18} />, label: 'Mes Demandes' },
    { to: '/employee/new', icon: <Plus size={18} />, label: 'Nouvelle demande' },
  ],
  chef_service: [
    { to: '/chef-service', icon: <Clock size={18} />, label: 'Demandes en attente' },
    { to: '/chef-service/calendar', icon: <Calendar size={18} />, label: 'Calendrier équipe' },
    { to: '/chef-service/history', icon: <History size={18} />, label: 'Historique équipe' },
    { to: '/employee/new', icon: <Plus size={18} />, label: "Ma demande d'absence" },
  ],
  directeur: [
    { to: '/directeur', icon: <Building2 size={18} />, label: 'Vue Exécutive' },
    { to: '/directeur/pending', icon: <CheckSquare size={18} />, label: 'Approbations finales' },
    { to: '/directeur/stats', icon: <BarChart2 size={18} />, label: 'Statistiques globales' },
    { to: '/directeur/calendar', icon: <CalendarDays size={18} />, label: 'Calendrier' },
  ],
  admin: [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Tableau de bord' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Utilisateurs' },
    { to: '/admin/departments', icon: <Building2 size={18} />, label: 'Départements' },
    { to: '/admin/services', icon: <FolderOpen size={18} />, label: 'Services' },
    { to: '/admin/types', icon: <BookOpen size={18} />, label: "Types d'absence" },
    { to: '/admin/requests', icon: <FileText size={18} />, label: 'Toutes les demandes' },
    { to: '/admin/audit', icon: <ShieldCheck size={18} />, label: "Journal d'audit" },
    { to: '/admin/calendar', icon: <CalendarDays size={18} />, label: 'Calendrier' },
  ],
};

export default function Sidebar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [showModal, setShowModal] = useState(false);

  const items = NAV_BY_ROLE[user?.role] || [];

  const confirmLogout = async () => {
    try { await logout().unwrap(); } catch { /* ignore */ }
    dispatch(clearCredentials());
    navigate('/');
  };

  return (
    <>
      <aside className="sidebar">
        {/* Logo */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '24px 16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <img
            src="/logo-white.png"
            alt="Logo"
            style={{ height: 64, width: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Nav */}
        <nav className="sidebar-nav py-4 px-3 gap-1 list-none">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.split('/').length <= 2}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout btn */}
        <div style={{ marginTop: 'auto', padding: '20px 16px' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '11px 16px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px',
              color: '#fca5a5', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.2)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
            }}
          >
            <LogOut size={17} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff', borderRadius: '20px',
            padding: '36px 32px', maxWidth: '400px', width: '90%',
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          }}>
            {/* Icon */}
            <div style={{
              width: '68px', height: '68px', borderRadius: '50%',
              background: '#fee2e2', color: '#ef4444',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <LogOut size={30} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Se déconnecter ?
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
              Êtes-vous sûr de vouloir quitter votre session ? Vous devrez vous reconnecter pour accéder à votre espace.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, padding: '13px',
                  border: '1.5px solid #e2e8f0', borderRadius: '12px',
                  background: '#fff', color: '#475569',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                style={{
                  flex: 1, padding: '13px',
                  border: 'none', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: '#fff',
                  fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(239,68,68,0.35)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Oui, déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
