import React, { useState } from 'react';
import { useGetChefPendingRequestsQuery, useReviewChefRequestMutation } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import ApprovalTimeline from '../../components/ApprovalTimeline';

export default function ChefPending() {
  const { data, isLoading } = useGetChefPendingRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] = useReviewChefRequestMutation();

  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = data?.data || []; // Assuming paginated response from backend

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
                <td>{req.start_date} au {req.end_date}</td>
                <td className="text-center"><span className="badge badge-info">{req.days_count} j</span></td>
                <td>{new Date(req.created_at).toLocaleDateString('fr-FR')}</td>
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
            
            <div className="grid-2 mb-4 text-sm bg-gray-50 p-4 rounded" style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)' }}>
              <div><strong className="text-muted block text-xs uppercase">Type</strong> {selectedReq.absence_type?.name}</div>
              <div><strong className="text-muted block text-xs uppercase">Durée</strong> {selectedReq.days_count} jours</div>
              <div><strong className="text-muted block text-xs uppercase">Période</strong> {selectedReq.start_date} <span className="text-muted">au</span> {selectedReq.end_date}</div>
              <div style={{ gridColumn: 'span 2', marginTop: '.5rem' }}>
                <strong className="text-muted block text-xs uppercase">Motif de l'employé</strong>
                <p className="mt-1">{selectedReq.reason || <span className="text-muted italic">Aucun motif fourni</span>}</p>
              </div>
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
