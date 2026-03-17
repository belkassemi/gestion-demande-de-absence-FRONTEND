import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/api/absenceApi';
import { 
  LayoutDashboard, List, Plus, Clock, Calendar, History, 
  CheckSquare, BarChart2, PieChart, Building, Users, FolderOpen, LogOut 
} from 'lucide-react';

const NAV_BY_ROLE = {
  employee: [
    { to: '/employee',          icon: <LayoutDashboard size={18} />, label: 'Mon Tableau de bord' },
    { to: '/employee/requests', icon: <List size={18} />, label: 'Mes Demandes' },
    { to: '/employee/new',      icon: <Plus size={18} />, label: 'Nouvelle demande' },
  ],
  chef: [
    { to: '/chef',          icon: <Clock size={18} />, label: 'Demandes en attente' },
    { to: '/chef/calendar', icon: <Calendar size={18} />, label: 'Calendrier équipe' },
    { to: '/chef/history',  icon: <History size={18} />, label: 'Historique équipe' },
  ],
  rh: [
    { to: '/rh',          icon: <CheckSquare size={18} />, label: 'Validation RH' },
    { to: '/rh/balances', icon: <BarChart2 size={18} />, label: 'Soldes employés' },
    { to: '/rh/reports',  icon: <PieChart size={18} />, label: 'Rapports & stats' },
  ],
  directeur: [
    { to: '/directeur',       icon: <Building size={18} />, label: 'Vue Exécutive' },
    { to: '/directeur/stats', icon: <BarChart2 size={18} />, label: 'Statistiques globales' },
  ],
  admin: [
    { to: '/admin',       icon: <Users size={18} />, label: 'Gestion utilisateurs' },
    { to: '/admin/types', icon: <FolderOpen size={18} />, label: 'Types d\'absence' },
  ],
};

const ROLE_LABELS = {
  employee:  'Employé',
  chef:      'Chef de Division',
  rh:        'Ressources Humaines',
  directeur: 'Directeur Général',
  admin:     'Administrateur',
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
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/logo-fr.png" alt="Logo" style={{ height: 36, width: 36, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <span>GesAbsences</span>
          <small>{ROLE_LABELS[user?.role] || ''}</small>
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
