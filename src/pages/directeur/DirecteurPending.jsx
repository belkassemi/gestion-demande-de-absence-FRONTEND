import React, { useState } from 'react';
import { useGetDirecteurPendingRequestsQuery, useReviewDirecteurRequestMutation } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import ApprovalTimeline from '../../components/ApprovalTimeline';
import { CheckCircle, FileText } from 'lucide-react';
import { STORAGE_URL } from '../../features/api/apiSlice';

export default function DirecteurPending() {
  const { data, isLoading } = useGetDirecteurPendingRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] = useReviewDirecteurRequestMutation();
  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = data || [];

  const handleReview = async (action) => {
    try {
      await reviewRequest({ id: selectedReq.id, action, comment }).unwrap();
      alert(`Décision finale : ${action === 'approve' ? 'Approuvée' : 'Rejetée'} avec succès`);
      setSelectedReq(null);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || "Erreur lors de la validation");
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-6">Demandes en attente de validation finale (Niveau 2)</h2>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employé</th>
              <th>Département</th>
              <th>Type</th>
              <th>Jours</th>
              <th>Avis Chef Service</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-8">Aucune demande en attente</td></tr>
            ) : requests.map(req => {
              // Extract Chef Service approval (level 1)
              const chefApproval = req.approvals?.find(a => a.level === 1);
              
              return (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td className="font-semibold">{req.user?.name}</td>
                  <td className="text-muted text-xs">{req.user?.department?.name || 'N/A'}</td>
                  <td>{req.absence_type?.name}</td>
                  <td className="font-bold">{req.days_count} j</td>
                  <td className="text-xs">
                    {chefApproval && chefApproval.status === 'approved' ? (
                      <span className="text-success flex items-center gap-1">
                        <CheckCircle size={14} /> Favorable
                      </span>
                    ) : '-'}
                  </td>
                  <td>
                    <button className="btn btn-primary btn-sm" onClick={() => setSelectedReq(req)}>Décision Finale</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Décision Finale - Demande #{selectedReq.id}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>
            
            <div className="grid-2 mb-6 text-sm" style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', gap: '1.25rem 2rem' }}>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Employé</span>
                <span className="font-semibold text-base">{selectedReq.user?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Type d'absence</span>
                <span className="font-semibold text-base">{selectedReq.absence_type?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Durée totale</span>
                <span className="font-semibold text-base">{selectedReq.days_count} jours</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Période du congé</span>
                <span className="font-medium text-sm">
                  {selectedReq.start_date} <span className="text-muted mx-1">au</span> {selectedReq.end_date}
                </span>
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
                    <span className="text-muted text-[10px] font-bold uppercase tracking-wider block mb-1">Motif de l'employé</span>
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                      {selectedReq.reason || "Aucun motif fourni"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <h3 className="font-semibold text-sm border-b pb-2 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>Historique des avis (Chef & RH)</h3>
            <div className="mb-6 bg-white p-3 rounded shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <ApprovalTimeline approvals={selectedReq.approvals} />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Commentaire de décision</label>
              <textarea 
                className="form-input" rows="2" 
                placeholder="Motif de la décision..." value={comment} onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="modal-footer border-t pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReq(null)} disabled={isReviewing}>Annuler</button>
              <button className="btn btn-danger" onClick={() => handleReview('reject')} disabled={isReviewing || !comment.trim()}>Rejeter Définitivement</button>
              <button className="btn btn-success" onClick={() => handleReview('approve')} disabled={isReviewing}>Approuver Définitivement</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
