import React, { useState } from 'react';
import { useGetChefPendingRequestsQuery, useReviewChefRequestMutation } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import { STORAGE_URL } from '../../features/api/apiSlice';
import { FileText } from 'lucide-react';

import ApprovalTimeline from '../../components/ApprovalTimeline';
import { formatDate } from '../../lib/utils';

export default function ChefPending() {
  const { data, isLoading } = useGetChefPendingRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] = useReviewChefRequestMutation();

  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = Array.isArray(data) ? data : (data?.data || []); // Handle flat arrays correctly

  const handleReview = async (action) => {
    try {
      await reviewRequest({ id: selectedReq.id, action, comment }).unwrap();
      alert(`Demande ${action === 'approve' ? 'approuvée' : 'rejetée'} avec succès`);
      setSelectedReq(null);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || "Erreur lors de la validation");
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-6">Demandes en attente de validation (Équipe)</h2>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employé</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Jours</th>
              <th>Date Demande</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-8">Aucune demande en attente</td></tr>
            ) : requests.map(req => (
              <tr key={req.id}>
                <td>#{req.id}</td>
                <td className="font-semibold">{req.user?.name}</td>
                <td>{req.absence_type?.name}</td>
                <td>{formatDate(req.start_date)} au {formatDate(req.end_date)}</td>
                <td className="text-center"><span className="badge badge-info">{req.days_count} j</span></td>
                <td>{formatDate(req.created_at)}</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => setSelectedReq(req)}>Examiner</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Examen Demande #{selectedReq.id} - {selectedReq.user?.name}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>
            
            <div className="grid-2 mb-6 text-sm" style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)', padding: '1.25rem 1.5rem', gap: '1.25rem 2rem' }}>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Type d'absence</span>
                <span className="font-semibold text-base">{selectedReq.absence_type?.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Durée totale</span>
                <span className="font-semibold text-base">{selectedReq.days_count} jours</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-muted text-[10px] font-bold uppercase tracking-wider">Période du congé</span>
                <span className="font-medium text-sm">
                  {formatDate(selectedReq.start_date)}
                  <span className="mx-2 text-muted">au</span>
                  {formatDate(selectedReq.end_date)}
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

            <div className="form-group mb-6">
              <label className="form-label">Commentaire de validation (Obligatoire pour refus)</label>
              <textarea 
                className="form-input" 
                rows="3" 
                placeholder="Ajouter un commentaire ou motif de refus..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="modal-footer border-t pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReq(null)} disabled={isReviewing}>Annuler</button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleReview('reject')} 
                disabled={isReviewing || !comment.trim()}
                title={!comment.trim() ? "Un commentaire est requis pour refuser" : ""}
              >
                Refuser
              </button>
              <button className="btn btn-success" onClick={() => handleReview('approve')} disabled={isReviewing}>
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
