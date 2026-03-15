import React from 'react';
import { Hourglass, CheckCircle2, XCircle, Ban, Info } from 'lucide-react';

const STATUS_MAP = {
  pending:   { label: 'En attente', cls: 'badge-pending',  Icon: Hourglass },
  approved:  { label: 'Approuvé',   cls: 'badge-approved', Icon: CheckCircle2 },
  rejected:  { label: 'Rejeté',     cls: 'badge-rejected', Icon: XCircle },
  cancelled: { label: 'Annulé',     cls: 'badge-cancelled',Icon: Ban },
};

export default function StatusBadge({ status }) {
  const meta = STATUS_MAP[status];
  const label = meta ? meta.label : status;
  const cls = meta ? meta.cls : 'badge-info';
  const Icon = meta ? meta.Icon : Info;
  
  return (
    <span className={`badge ${cls}`}>
      <Icon size={14} /> {label}
    </span>
  );
}
