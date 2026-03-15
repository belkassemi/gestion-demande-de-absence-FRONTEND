import React from 'react';
import { useGetMyStatsQuery } from '../../features/api/absenceApi';
import { CalendarCheck, Hourglass, CheckCircle, XCircle } from 'lucide-react';

export default function EmployeeOverview() {
  const { data: stats, isLoading } = useGetMyStatsQuery();

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (!stats) return <div className="alert alert-error">Erreur de chargement des statistiques.</div>;

  return (
    <div>
      <h2 className="mb-6 font-bold" style={{ fontSize: '1.25rem' }}>Aperçu de l'année {stats.year}</h2>
      
      <div className="grid-4 mb-6">
        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <CalendarCheck size={28} className="opacity-80" />
            <div className="stat-label flex-1 text-white opacity-90">Jours Approuvés</div>
          </div>
          <div className="stat-value">{stats.total_days}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <Hourglass size={28} className="text-[var(--warning)] opacity-80" />
            <div className="stat-label flex-1">En attente</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} className="text-[var(--success)] opacity-80" />
            <div className="stat-label flex-1">Approuvées</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.approved}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={28} className="text-[var(--error)] opacity-80" />
            <div className="stat-label flex-1">Rejetées</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>{stats.rejected}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Répartition par type</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>Type</th>
                <th>Jours</th>
                <th>Demandes</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.by_type).length === 0 ? (
                <tr><td colSpan="3" className="text-muted text-center py-4">Aucune donnée</td></tr>
              ) : (
                Object.entries(stats.by_type).map(([typeId, data]) => (
                  <tr key={typeId}>
                    <td>Type #{typeId}</td>
                    <td className="font-bold">{data.days}</td>
                    <td>{data.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Évolution mensuelle</h3>
          {/* Simple CSS bar chart representation since Recharts might be overkill for this quick view */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px', marginTop: '2rem' }}>
            {Object.keys(stats.monthly).length === 0 ? (
               <div className="text-muted text-sm w-full text-center">Aucune demande cette année</div>
            ) : Object.entries(stats.monthly).map(([month, count]) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', backgroundColor: 'var(--primary-light)', height: `${Math.min(count * 20, 100)}%`, borderRadius: '4px 4px 0 0', minHeight: '4px' }} title={`${count} demandes`} />
                <span className="text-xs text-muted">{month.split('-')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
