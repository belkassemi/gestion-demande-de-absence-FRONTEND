import React from 'react';
import { useGetDirecteurDashboardQuery } from '../../features/api/absenceApi';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

export default function DirecteurOverview() {
  const { data: stats, isLoading, isError } = useGetDirecteurDashboardQuery();

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (isError || !stats) return <div className="alert alert-error">Erreur de chargement du tableau de bord.</div>;

  return (
    <div>
      <h2 className="font-bold mb-6" style={{ fontSize: '1.25rem' }}>Tableau de bord de la Direction</h2>

      {/* KPI Cards */}
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={28} className="opacity-80" style={{ color: 'var(--warning)' }} />
            <div className="stat-label flex-1">En attente (Niveau 2)</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>
            {stats.pending_for_directeur}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} style={{ color: 'var(--success)' }} />
            <div className="stat-label flex-1">Approuvées (ce mois)</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>
            {stats.approved_this_month}
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={28} style={{ color: 'var(--error)' }} />
            <div className="stat-label flex-1">Rejetées (ce mois)</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>
            {stats.rejected_this_month}
          </div>
        </div>

        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={28} className="opacity-80" color="white" />
            <div className="stat-label flex-1 text-white opacity-90">Taux d'approbation</div>
          </div>
          <div className="stat-value text-white">{stats.approval_rate}%</div>
        </div>
      </div>

      {/* Monthly Trend Table */}
      <div className="card">
        <h3 className="font-semibold mb-4 text-sm">Tendance mensuelle (6 derniers mois)</h3>
        {stats.trend && stats.trend.length > 0 ? (
          <div className="table-wrapper">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Mois</th>
                  <th style={{ color: 'var(--success)' }}>Approuvées</th>
                  <th style={{ color: 'var(--error)' }}>Rejetées</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.trend.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{row.month}</td>
                    <td style={{ color: 'var(--success)' }}>{row.approved}</td>
                    <td style={{ color: 'var(--error)' }}>{row.rejected}</td>
                    <td className="text-muted">{row.approved + row.rejected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-sm">Aucune donnée disponible pour les 6 derniers mois.</p>
        )}
      </div>
    </div>
  );
}
