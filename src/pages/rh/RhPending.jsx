import React, { useState } from 'react';
import { useGetRhPendingRequestsQuery, useReviewRhRequestMutation } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import ApprovalTimeline from '../../components/ApprovalTimeline';

export default function RhPending() {
  const { data, isLoading } = useGetRhPendingRequestsQuery();
  const [reviewRequest, { isLoading: isReviewing }] = useReviewRhRequestMutation();
  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const requests = data?.data || [];

  const handleReview = async (action) => {
    try {
      await reviewRequest({ id: selectedReq.id, action, comment }).unwrap();
      alert(`Validation RH : ${action === 'approve' ? 'Approuvée' : 'Rejetée'} avec succès`);
      setSelectedReq(null);
      setComment('');
    } catch (err) {
      alert(err?.data?.message || "Erreur lors de la validation");
    }
  };

  return (
    <div>
      <h2 className="font-bold mb-6">Demandes en attente de vérification RH (Niveau 2)</h2>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employé</th>
              <th>Département</th>
              <th>Type</th>
              <th>Période</th>
              <th>Date Demande</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="7" className="text-center text-muted py-8">Aucune demande en attente RH</td></tr>
            ) : requests.map(req => (
              <tr key={req.id}>
                <td>#{req.id}</td>
                <td className="font-semibold">{req.user?.name}</td>
                <td className="text-muted text-xs">{req.user?.department?.name || 'N/A'}</td>
                <td>{req.absence_type?.name}</td>
                <td>{req.start_date} <br/><span className="text-xs text-muted">({req.days_count} j)</span></td>
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
              <h2>Examen RH Demande #{selectedReq.id}</h2>
              <button className="modal-close" onClick={() => setSelectedReq(null)}>&times;</button>
            </div>
            
            <div className="grid-2 mb-4 text-sm bg-gray-50 p-4 rounded" style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)' }}>
              <div><strong className="text-muted block text-xs uppercase">Employé</strong> {selectedReq.user?.name}</div>
              <div><strong className="text-muted block text-xs uppercase">Type</strong> {selectedReq.absence_type?.name}</div>
              <div><strong className="text-muted block text-xs uppercase">Durée</strong> {selectedReq.days_count} jours</div>
              <div><strong className="text-muted block text-xs uppercase">Période</strong> {selectedReq.start_date} au {selectedReq.end_date}</div>
            </div>

            <h3 className="font-semibold text-sm border-b pb-2 mb-4" style={{ borderBottom: '1px solid var(--border)' }}>Historique de validation</h3>
            <div className="mb-6 bg-white p-3 rounded shadow-sm border" style={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 'var(--radius-sm)' }}>
              <ApprovalTimeline approvals={selectedReq.approvals} />
            </div>

            <div className="form-group mb-6">
              <label className="form-label">Note RH (Optionnel si approbation)</label>
              <textarea 
                className="form-input" rows="2" 
                placeholder="Avis RH..." value={comment} onChange={e => setComment(e.target.value)}
              />
            </div>

            <div className="modal-footer border-t pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedReq(null)} disabled={isReviewing}>Annuler</button>
              <button className="btn btn-danger" onClick={() => handleReview('reject')} disabled={isReviewing || !comment.trim()}>Refuser</button>
              <button className="btn btn-success" onClick={() => handleReview('approve')} disabled={isReviewing}>Approuver (Transmettre DA)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
