import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/api/absenceApi';
import {
  LayoutDashboard, List, Plus, Clock, Calendar, History,
  CheckSquare, BarChart2, Building2, Users, FolderOpen,
  LogOut, FileText, ShieldCheck, BookOpen
} from 'lucide-react';

const NAV_BY_ROLE = {
  employee: [
    { to: '/employee/requests', icon: <List size={18} />,           label: 'Mes Demandes' },
    { to: '/employee/new',      icon: <Plus size={18} />,           label: 'Nouvelle demande' },
  ],
  chef_service: [
    { to: '/chef-service',          icon: <Clock size={18} />,    label: 'Demandes en attente' },
    { to: '/chef-service/calendar', icon: <Calendar size={18} />, label: 'Calendrier équipe' },
    { to: '/chef-service/history',  icon: <History size={18} />,  label: 'Historique équipe' },
    { to: '/employee/new',          icon: <Plus size={18} />,     label: 'Ma demande d\'absence' },
  ],
  directeur: [
    { to: '/directeur',         icon: <Building2 size={18} />,   label: 'Vue Exécutive' },
    { to: '/directeur/pending', icon: <CheckSquare size={18} />, label: 'Approbations finales' },
    { to: '/directeur/stats',   icon: <BarChart2 size={18} />,   label: 'Statistiques globales' },
  ],
  admin: [
    { to: '/admin',              icon: <LayoutDashboard size={18} />, label: 'Tableau de bord' },
    { to: '/admin/users',        icon: <Users size={18} />,          label: 'Utilisateurs' },
    { to: '/admin/departments',  icon: <Building2 size={18} />,      label: 'Départements' },
    { to: '/admin/services',     icon: <FolderOpen size={18} />,     label: 'Services' },
    { to: '/admin/types',        icon: <BookOpen size={18} />,       label: 'Types d\'absence' },
    { to: '/admin/requests',     icon: <FileText size={18} />,       label: 'Toutes les demandes' },
    { to: '/admin/audit',        icon: <ShieldCheck size={18} />,    label: 'Journal d\'audit' },
  ],
};

const ROLE_LABELS = {
  employee:    'Employé',
  chef_service: 'Chef de Service',
  directeur:   'Directeur Général',
  admin:       'Administrateur',
};

export default function Sidebar() {
  const user     = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const items = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    try { await logout().unwrap(); } catch { /* ignore */ }
    dispatch(clearCredentials());
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ flexDirection:'column', alignItems:'center', gap:8, padding:'20px 16px', textAlign:'center' }}>
        <img src="/logo-fr.png" alt="Logo" style={{ height: 110, width: 'auto', maxWidth: 200, objectFit: 'contain' }} />
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:'0.95rem' }}>GesAbsences</span>
          <small style={{ display:'block' }}>{ROLE_LABELS[user?.role] || ''}</small>
        </div>
      </div>

      <nav className="sidebar-nav">
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

      <div style={{ padding:'16px', marginTop:'auto', borderTop:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div className="avatar">{initials}</div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        <button className="btn btn-secondary w-full" style={{ width:'100%', justifyContent:'center' }} onClick={handleLogout}>
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
