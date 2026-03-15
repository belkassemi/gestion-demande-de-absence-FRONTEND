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
      <div className="sidebar-logo flex items-center gap-3 p-4 mb-4 border-b border-[var(--border)]">
        <img src="/logo-fr.png" alt="Logo" className="h-8 object-contain" />
        <div className="flex flex-col">
          <span className="font-bold text-[var(--primary-dark)]">GesAbsences</span>
          <small className="text-[0.7rem] text-muted">{ROLE_LABELS[user?.role] || ''}</small>
        </div>
      </div>

      <nav className="sidebar-nav px-3 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            className={({ isActive }) => 
              `nav-item flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? 'active bg-[var(--primary-bg)] text-[var(--primary-dark)] font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
            }
          >
            <span className="nav-icon flex items-center justify-center text-current">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="avatar w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">{initials}</div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-gray-900 truncate">{user?.name}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
        </div>
        <button 
          className="btn btn-secondary w-full flex items-center justify-center gap-2 py-2 text-sm transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
          onClick={handleLogout}
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
