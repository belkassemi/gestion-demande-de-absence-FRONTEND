import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials, selectCurrentUser } from '../features/auth/authSlice';
import { useLogoutMutation } from '../features/api/absenceApi';
import {
  LayoutDashboard, List, Plus, Clock, Calendar, History,
  CheckSquare, BarChart2, Building2, Users, FolderOpen,
  LogOut, FileText, ShieldCheck, BookOpen, CalendarDays
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_BY_ROLE = {
  employee: [
    { to: '/employee/requests', icon: <List size={18} />, label: 'Mes Demandes' },
    { to: '/employee/new', icon: <Plus size={18} />, label: 'Nouvelle demande' },
  ],
  chef_service: [
    { to: '/chef-service', icon: <Clock size={18} />, label: 'Demandes en attente' },
    { to: '/chef-service/calendar', icon: <Calendar size={18} />, label: 'Calendrier équipe' },
    { to: '/chef-service/history', icon: <History size={18} />, label: 'Historique équipe' },
    { to: '/employee/new', icon: <Plus size={18} />, label: 'Ma demande d\'absence' },
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
    { to: '/admin/types', icon: <BookOpen size={18} />, label: 'Types d\'absence' },
    { to: '/admin/requests', icon: <FileText size={18} />, label: 'Toutes les demandes' },
    { to: '/admin/audit', icon: <ShieldCheck size={18} />, label: 'Journal d\'audit' },
    { to: '/admin/calendar', icon: <CalendarDays size={18} />, label: 'Calendrier' },
  ],
};

const ROLE_LABELS = {
  employee: 'Employé',
  chef_service: 'Chef de Service',
  directeur: 'Directeur Général',
  admin: 'Administrateur',
};

export default function Sidebar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const items = NAV_BY_ROLE[user?.role] || [];

  const handleLogout = async () => {
    try { await logout().unwrap(); } catch { /* ignore */ }
    dispatch(clearCredentials());
    navigate('/');
  };


  return (
    <aside className="sidebar">
      <div className="sidebar-logo flex flex-col items-center py-6 px-4 text-center border-b border-border/60">
        <img src="/logo-fr.png" alt="Logo" className="object-contain" style={{ height: 60, width: 'auto' }} />
      </div>

      <nav className="sidebar-nav py-6 px-4 gap-1.5 list-none">
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

      <div className="mt-auto px-6 py-6">
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 w-full py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold transition-all h-auto"
          onClick={handleLogout}
        >
          <LogOut size={18} /> Déconnexion
        </Button>
      </div>
    </aside>
  );
}
