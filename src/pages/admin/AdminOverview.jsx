import React from 'react';
import { useGetAdminDashboardQuery, useGetAdminStatisticsQuery } from '../../features/api/absenceApi';
import { Users, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const { data: kpi, isLoading: kpiLoading } = useGetAdminDashboardQuery();
  const { data: stats, isLoading: statsLoading } = useGetAdminStatisticsQuery({});

  if (kpiLoading || statsLoading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <h2 className="font-bold mb-6" style={{ fontSize: '1.25rem' }}>Tableau de bord Administration</h2>

      {/* KPI Cards */}
      <div className="grid-4 mb-6">
        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <FileText size={28} className="opacity-80" />
            <div className="stat-label flex-1 text-white opacity-90">Total demandes</div>
          </div>
          <div className="stat-value">{kpi?.total_requests ?? '–'}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="flex items-center gap-3 mb-2">
            <Clock size={28} style={{ color: 'var(--warning)' }} />
            <div className="stat-label flex-1">En attente</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{kpi?.pending ?? '–'}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} style={{ color: 'var(--success)' }} />
            <div className="stat-label flex-1">Approuvées</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{kpi?.approved ?? '–'}</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--error)' }}>
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={28} style={{ color: 'var(--error)' }} />
            <div className="stat-label flex-1">Rejetées</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>{kpi?.rejected ?? '–'}</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* By Department */}
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Absences par département</h3>
          {stats?.by_department?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Département</th>
                  <th>Total</th>
                  <th>Approuvées</th>
                  <th>Jours</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_department.map((d, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{d.department}</td>
                    <td>{d.total}</td>
                    <td style={{ color: 'var(--success)' }}>{d.approved}</td>
                    <td className="font-bold">{d.total_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted text-sm">Aucune donnée disponible.</p>}
        </div>

        {/* By Type */}
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Absences par type</h3>
          {stats?.by_type?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Demandes</th>
                  <th>Jours</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_type.map((t, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{t.type}</td>
                    <td>{t.count}</td>
                    <td className="font-bold">{t.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted text-sm">Aucune donnée disponible.</p>}
        </div>
      </div>

      {/* Quick links */}
      <div className="card mt-6">
        <h3 className="font-semibold mb-4 text-sm">Accès rapide</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { to: '/admin/users', label: 'Gérer les utilisateurs' },
            { to: '/admin/departments', label: 'Gérer les départements' },
            { to: '/admin/services', label: 'Gérer les services' },
            { to: '/admin/types', label: 'Types d\'absence' },
            { to: '/admin/requests', label: 'Toutes les demandes' },
            { to: '/admin/audit', label: 'Journal d\'audit' },
          ].map(link => (
            <Link key={link.to} to={link.to} className="btn btn-secondary btn-sm">{link.label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
