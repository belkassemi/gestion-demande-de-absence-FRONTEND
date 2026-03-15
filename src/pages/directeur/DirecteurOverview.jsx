import React from 'react';
import { useGetDirecteurDashboardQuery } from '../../features/api/absenceApi';

export default function DirecteurOverview() {
  const { data: stats, isLoading } = useGetDirecteurDashboardQuery();

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (!stats) return <div className="alert alert-error">Erreur de chargement.</div>;

  return (
    <div>
      <h2 className="font-bold mb-6">Tableau de bord de la Direction</h2>

      <div className="grid-4 mb-6">
        <div className="stat-card primary">
          <div className="stat-label">Demandes Traitées (Mois)</div>
          <div className="stat-value">{stats.monthly_processed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">À Valider (Niveau 3)</div>
          <div className="stat-value text-warning" style={{ color: 'var(--warning)' }}>{stats.pending_level_3}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Taux d'Approbation</div>
          <div className="stat-value text-success" style={{ color: 'var(--success)' }}>
             {stats.monthly_processed > 0 
                ? Math.round((stats.monthly_approved / stats.monthly_processed) * 100) 
                : 0}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Absences auj.</div>
          <div className="stat-value">{stats.absent_today} employés</div>
        </div>
      </div>

      <div className="card text-sm">
        <div className="flex justify-between items-center mb-4 border-b pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <h3 className="font-semibold text-sm">Absents d'aujourd'hui</h3>
        </div>
        {stats.absent_today > 0 ? (
          <p className="text-muted">Des employés sont actuellement en absence (données détaillées dans /stats).</p>
        ) : (
          <p className="text-muted">Aucune absence approuvée pour aujourd'hui sur l'ensemble du personnel.</p>
        )}
      </div>
    </div>
  );
}
