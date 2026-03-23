import React, { useState } from 'react';
import { useGetMyRequestsQuery, useCancelRequestMutation } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import ApprovalTimeline from '../../components/ApprovalTimeline';
import { STORAGE_URL } from '../../features/api/apiSlice';
import { FileText } from 'lucide-react';

export default function EmployeeRequests() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetMyRequestsQuery({ page });
  const [cancelRequest] = useCancelRequestMutation();

  const [selectedReq, setSelectedReq] = useState(null);

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = data?.data || [];

  const handleCancel = async (id) => {
    if (window.confirm("Voulez-vous vraiment annuler cette demande ?")) {
      try {
        await cancelRequest(id).unwrap();
        alert("Demande annulée avec succès");
        setSelectedReq(null);
      } catch (err) {
        alert(err?.data?.message || "Erreur lors de l'annulation");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Historique de mes demandes</h2>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Jours</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="7" className="text-center text-muted py-4">Aucune demande trouvée</td></tr>
              ) : requests.map(req => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td className="font-semibold">{req.absence_type?.name}</td>
                  <td>{req.start_date}</td>
                  <td>{req.end_date}</td>
                  <td>{req.days_count}</td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedReq(req)}>
                      Détails
                    </button>
                    {req.status === 'pending' && (
                      <button className="btn btn-danger btn-sm ml-2" onClick={() => handleCancel(req.id)} style={{ marginLeft: '.5rem' }}>
                        Annuler
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination minimaliste */}
        <div className="flex justify-between items-center p-4 border-t" style={{ borderTop: '1px solid var(--border)' }}>
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={page === 1 || isFetching} 
            onClick={() => setPage(p => p - 1)}
          >Précédent</button>
          <span className="text-sm text-muted">Page {data?.current_page} sur {data?.last_page}</span>
          <button 
            className="btn btn-secondary btn-sm" 
            disabled={page === data?.last_page || isFetching} 
            onClick={() => setPage(p => p + 1)}
          >Suivant</button>
        </div>
      </div>

      {/* Modal Détails */}
      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h2>Détails Demande #{selectedReq.id}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>

            {/* Info grid — no outer border, clean background */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1.25rem 2rem',
              background: 'var(--primary-bg)',
              borderRadius: 'var(--radius)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem'
            }}>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>Type d'absence</span>
                <span style={{ fontWeight: 600 }}>{selectedReq.absence_type?.name}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>Durée totale</span>
                <span style={{ fontWeight: 600 }}>{selectedReq.days_count} jours</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>Date de début</span>
                <span>{new Date(selectedReq.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '4px' }}>Date de fin</span>
                <span>{new Date(selectedReq.end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Statut */}
              <div style={{ gridColumn: 'span 2', paddingTop: '.75rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '6px' }}>Statut actuel</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <StatusBadge status={selectedReq.status} />
                  {selectedReq.status === 'pending' && (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      — En attente de validation niveau {selectedReq.current_level}
                    </span>
                  )}
                </div>
              </div>

              {selectedReq.document_path && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '8px' }}>Document justificatif</span>
                  <a href={`${STORAGE_URL}/${selectedReq.document_path}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm inline-flex items-center gap-2">
                    <FileText size={15} /> Voir le document
                  </a>
                </div>
              )}

              {selectedReq.reason && (
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: '6px' }}>Motif</span>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                    {selectedReq.reason}
                  </p>
                </div>
              )}
            </div>

            <h3 style={{ fontWeight: 600, fontSize: '13px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '14px' }}>
              Circuit de validation
            </h3>
            <div className="mb-4">
               <ApprovalTimeline approvals={selectedReq.approvals} />
            </div>

            <div className="modal-footer">
               <button className="btn btn-secondary" onClick={() => setSelectedReq(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
