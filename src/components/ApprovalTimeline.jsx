import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const LEVEL_LABELS = ['Chef', 'RH', 'Directeur'];

export default function ApprovalTimeline({ approvals = [] }) {
  const ordered = [...approvals].sort((a, b) => a.level - b.level);

  return (
    <div className="timeline">
      {LEVEL_LABELS.map((label, i) => {
        const level = i + 1;
        const ap    = ordered.find(a => a.level === level);
        const status = ap?.status || 'pending';

        const icons = { 
          approved: <CheckCircle size={16} className="text-white" />, 
          rejected: <XCircle size={16} className="text-white" />, 
          pending: <Clock size={16} className="text-gray-500" /> 
        };

        return (
          <div key={level} className="timeline-item">
            <div className="timeline-line flex flex-col items-center">
              <div 
                className={`timeline-dot flex items-center justify-center w-6 h-6 rounded-full ${
                  status === 'approved' ? 'bg-green-500' : 
                  status === 'rejected' ? 'bg-red-500' : 'bg-gray-200 border-2 border-gray-300'
                }`} 
                title={status}
              >
                {icons[status]}
              </div>
              {level < 3 && <div className={`timeline-connector w-0.5 h-10 ${status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`} />}
            </div>
            <div className="timeline-content pb-6 pl-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, fontSize: '.875rem' }}>Niveau {level} – {label}</span>
                {ap?.reviewed_at && (
                  <span className="text-xs text-muted">
                    {new Date(ap.reviewed_at).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}
                  </span>
                )}
              </div>
              {ap?.approver && (
                <div className="text-sm text-muted">{ap.approver.name}</div>
              )}
              {ap?.comment && (
                <div style={{ marginTop: '.25rem', fontSize: '.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  "{ap.comment}"
                </div>
              )}
              {!ap && <div className="text-xs text-muted" style={{ marginTop: '.2rem' }}>En attente…</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
