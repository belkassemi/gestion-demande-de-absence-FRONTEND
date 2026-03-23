import React, { useState } from 'react';
import { useGetAdminAllRequestsQuery, useGetDepartmentsQuery } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';
import ApprovalTimeline from '../../components/ApprovalTimeline';
import { FileText } from 'lucide-react';
import { STORAGE_URL } from '../../features/api/apiSlice';

export default function AdminAllRequests() {
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReq, setSelectedReq] = useState(null);

  const { data: reqData, isLoading } = useGetAdminAllRequestsQuery({ status: statusFilter, department_id: deptFilter, page });
  const { data: deptsData } = useGetDepartmentsQuery({});

  const requests = reqData?.data || [];
  const lastPage = reqData?.last_page || 1;
  const depts = deptsData?.data || deptsData || [];

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold flex items-center gap-2"><FileText size={22} /> Toutes les Demandes</h2>
        <div className="flex gap-3">
          <select className="form-input text-sm" value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="cancelled">Annulées</option>
          </select>
          <select className="form-input text-sm" value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}>
            <option value="">Tous les départements</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employé</th>
                <th>Département</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Jours</th>
                <th>Niveau</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!requests.length ? (
                <tr><td colSpan="9" className="text-center text-muted py-8">Aucune demande trouvée</td></tr>
              ) : requests.map(r => (
                <tr key={r.id}>
                  <td className="text-muted">#{r.id}</td>
                  <td className="font-semibold">{r.user?.name}</td>
                  <td className="text-muted text-xs">{r.user?.department?.name || '-'}</td>
                  <td>{r.absence_type?.name}</td>
                  <td className="text-xs">{r.start_date} → {r.end_date}</td>
                  <td className="text-center"><span className="badge badge-info">{r.days_count}j</span></td>
                  <td className="text-center text-xs font-semibold">N{r.current_level}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelectedReq(r)}>Détails</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lastPage > 1 && (
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</button>
            <span className="text-sm text-muted">Page {page} / {lastPage} — {reqData?.total} demandes</span>
            <button className="btn btn-secondary btn-sm" disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Suivant</button>
          </div>
        )}
      </div>

      {/* Detail Modal (read-only) */}
      {selectedReq && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Demande #{selectedReq.id} — {selectedReq.user?.name}</h2>
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
                    <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--surface)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
                      {selectedReq.reason || "Aucun motif fourni"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-sm border-b pb-2 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>Circuit d'approbation</h3>
            <ApprovalTimeline approvals={selectedReq.approvals} />
            <div className="modal-footer mt-4">
              <button className="btn btn-secondary" onClick={() => setSelectedReq(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
