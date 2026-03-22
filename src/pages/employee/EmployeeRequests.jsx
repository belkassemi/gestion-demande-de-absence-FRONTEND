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
          <div className="modal">
            <div className="modal-header">
              <h2>Détails Demande #{selectedReq.id}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>
            
            <div className="grid-2 mb-6 text-sm bg-gray-50 p-6 rounded-lg border border-border" style={{ background: 'var(--primary-bg)', gap: '1.5rem 2rem' }}>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Type d'absence</span>
                <span className="font-semibold text-base">{selectedReq.absence_type?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Durée totale</span>
                <span className="font-semibold text-base">{selectedReq.days_count} jours</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Date de début</span>
                <span className="font-medium text-sm">{selectedReq.start_date}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Date de fin</span>
                <span className="font-medium text-sm">{selectedReq.end_date}</span>
              </div>
              
              {(selectedReq.document_path || selectedReq.reason) && (
                <div className="col-span-2 border-t pt-4 mt-2 border-border/50 flex flex-col gap-4">
                  {selectedReq.document_path && (
                    <div>
                      <span className="text-muted text-[10px] font-bold uppercase tracking-wider block mb-2">Document Justificatif</span>
                      <a href={`${STORAGE_URL}/${selectedReq.document_path}`} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm inline-flex items-center gap-2 hover:bg-white transition-colors">
                        <FileText size={16} /> Voir le document
                      </a>
                    </div>
                  )}

                  <div>
                    <span className="text-muted text-[10px] font-bold uppercase tracking-wider block mb-1">Motif</span>
                    <p className="text-sm leading-relaxed text-text-primary bg-white/50 p-3 rounded-md italic border border-dashed border-border/60">
                      {selectedReq.reason || "Aucun motif fourni"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-sm border-b pb-2 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>
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
