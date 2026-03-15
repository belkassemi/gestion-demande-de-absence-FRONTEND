import React, { useState } from 'react';
import { useGetTeamHistoryQuery } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';

export default function ChefHistory() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  
  const { data, isLoading, isFetching } = useGetTeamHistoryQuery({ page, status });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Historique des demandes (Équipe)</h2>
        <select 
          className="form-input" 
          style={{ width: 'auto' }} 
          value={status} 
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          disabled={isFetching}
        >
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="approved">Approuvées</option>
          <option value="rejected">Rejetées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employé</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted py-8">Aucune demande trouvée</td></tr>
            ) : requests.map(req => (
               <tr key={req.id}>
                 <td>#{req.id}</td>
                 <td className="font-semibold">{req.user?.name}</td>
                 <td>{req.absence_type?.name}</td>
                 <td>{req.start_date} au {req.end_date}</td>
                 <td><StatusBadge status={req.status} /></td>
               </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex justify-between items-center p-4 border-t" style={{ borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={page === 1 || isFetching} 
            onClick={() => setPage(p => p - 1)}
          >Précédent</button>
          <span className="text-sm text-muted">Page {data?.current_page} sur {data?.last_page}</span>
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={page === data?.last_page || isFetching || !data?.last_page} 
            onClick={() => setPage(p => p + 1)}
          >Suivant</button>
        </div>
      </div>
    </div>
  );
}
