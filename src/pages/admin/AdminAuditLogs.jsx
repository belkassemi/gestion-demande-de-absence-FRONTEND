import React, { useState } from 'react';
import { useGetAuditLogsQuery } from '../../features/api/absenceApi';
import { ShieldCheck } from 'lucide-react';

const ACTION_COLORS = {
  created:             'badge-info',
  updated:             'badge-warning',
  deleted:             'badge-error',
  cancelled:           'badge-error',
  chef_approved:       'badge-success',
  chef_rejected:       'badge-error',
  directeur_approved:  'badge-success',
  directeur_rejected:  'badge-error',
};

export default function AdminAuditLogs() {
  const [page, setPage] = useState(1);
  const { data: logsData, isLoading } = useGetAuditLogsQuery({ page });

  const logs = logsData?.data || logsData || [];
  const lastPage = logsData?.last_page || 1;
  const total = logsData?.total;

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold flex items-center gap-2"><ShieldCheck size={22} /> Journal d'audit</h2>
        {total !== undefined && (
          <span className="text-muted text-sm">{total} entrées au total</span>
        )}
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Entité</th>
                <th>ID Entité</th>
                <th>Détails</th>
              </tr>
            </thead>
            <tbody>
              {!logs.length ? (
                <tr><td colSpan="7" className="text-center text-muted py-8">Aucune entrée dans le journal</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td className="text-muted">#{log.id}</td>
                  <td className="text-xs text-muted">
                    {new Date(log.timestamp || log.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td className="font-semibold">{log.user?.name || `#${log.user_id}`}</td>
                  <td>
                    <span className={`badge ${ACTION_COLORS[log.action] || 'badge-info'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="text-muted">{log.entity_type}</td>
                  <td className="text-center text-muted">#{log.entity_id}</td>
                  <td className="text-xs text-muted max-w-xs truncate" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lastPage > 1 && (
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</button>
            <span className="text-sm text-muted">Page {page} / {lastPage}</span>
            <button className="btn btn-secondary btn-sm" disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Suivant</button>
          </div>
        )}
      </div>
    </div>
  );
}
