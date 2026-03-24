import React, { useState, useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useGetAdminCalendarQuery } from '../../features/api/absenceApi';
import { Clock, CheckCircle, X, Building2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const DEPT_PALETTE = [
  '#6366f1', '#0ea5e9', '#10b981', '#f59e0b',
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
  '#ef4444', '#84cc16',
];

function getDeptColor(deptId, deptColorMap) {
  if (!deptId) return '#94a3b8';
  if (deptColorMap[deptId]) return deptColorMap[deptId];
  const idx = Object.keys(deptColorMap).length % DEPT_PALETTE.length;
  deptColorMap[deptId] = DEPT_PALETTE[idx];
  return deptColorMap[deptId];
}

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filterDept, setFilterDept] = useState('all');
  const calendarRef = useRef(null);
  const deptColorMap = useRef({});

  const monthStr = currentDate.toISOString().slice(0, 7);
  const { data, isLoading } = useGetAdminCalendarQuery({ month: monthStr });
  const absences = Array.isArray(data) ? data : (data?.data || []);

  const departments = useMemo(() => {
    const map = {};
    absences.forEach((r) => {
      const dept = r.user?.department;
      if (dept?.id && !map[dept.id]) {
        map[dept.id] = { id: dept.id, name: dept.name, color: getDeptColor(dept.id, deptColorMap.current) };
      }
    });
    return Object.values(map);
  }, [absences]);

  const filtered = filterDept === 'all'
    ? absences
    : absences.filter((r) => String(r.user?.department?.id) === String(filterDept));

  const events = filtered.map((req) => {
    const endDate = new Date(req.end_date);
    endDate.setDate(endDate.getDate() + 1);
    const deptId = req.user?.department?.id;
    const deptColor = getDeptColor(deptId, deptColorMap.current);
    const isPending = req.status === 'pending';

    return {
      id: req.id,
      title: req.user?.name,
      start: req.start_date,
      end: endDate.toISOString().split('T')[0],
      backgroundColor: deptColor,
      borderColor: isPending ? 'rgba(0,0,0,0.2)' : 'transparent',
      textColor: '#fff',
      extendedProps: {
        userName: req.user?.name,
        department: req.user?.department?.name,
        type: req.absence_type?.name,
        days: req.days_count,
        start: req.start_date,
        end: req.end_date,
        reason: req.reason,
        status: req.status,
        deptColor,
      },
    };
  });

  const handleDatesSet = (dateInfo) => {
    const mid = new Date(
      dateInfo.view.currentStart.getTime() +
      (dateInfo.view.currentEnd.getTime() - dateInfo.view.currentStart.getTime()) / 2
    );
    if (mid.toISOString().slice(0, 7) !== monthStr) setCurrentDate(mid);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Calendrier global</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Toutes les absences — tous les départements</p>
        </div>
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 500, color: '#334155', background: '#fff', cursor: 'pointer', minWidth: '180px' }}
        >
          <option value="all">Tous les départements</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {departments.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.25rem' }}>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => setFilterDept(filterDept === String(d.id) ? 'all' : String(d.id))}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 12px', borderRadius: '20px',
                border: `2px solid ${filterDept === String(d.id) ? d.color : 'transparent'}`,
                background: `${d.color}18`, fontSize: '12px', fontWeight: 600,
                color: d.color, cursor: 'pointer',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, display: 'inline-block' }} />
              {d.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', position: 'relative' }}>
        {isLoading && (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
            <div className="loader"><div className="spinner" /></div>
          </div>
        )}
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek' }}
          height="auto"
          datesSet={handleDatesSet}
          eventClick={(info) => setSelectedEvent(info.event)}
          displayEventTime={false}
          eventDisplay="block"
        />
      </div>

      {selectedEvent && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', maxWidth: '420px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 40, height: 40, borderRadius: '12px', background: selectedEvent.extendedProps.deptColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={18} style={{ color: selectedEvent.extendedProps.deptColor }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{selectedEvent.extendedProps.userName}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{selectedEvent.extendedProps.department}</div>
                </div>
              </div>
              <button onClick={() => setSelectedEvent(null)} style={{ width: 32, height: 32, borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} style={{ color: '#64748b' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8fafc', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Type d'absence</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedEvent.extendedProps.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Période</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{formatDate(selectedEvent.extendedProps.start)} → {formatDate(selectedEvent.extendedProps.end)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Durée</span>
                <span style={{ fontWeight: 700, color: '#1e293b' }}>{selectedEvent.extendedProps.days} jour(s)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <span style={{ color: '#334155', fontWeight: 600 }}>Statut</span>
                {selectedEvent.extendedProps.status === 'pending' ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
                    <Clock size={11} /> En attente
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: '12px', padding: '3px 10px', borderRadius: '20px' }}>
                    <CheckCircle size={11} /> Approuvée
                  </span>
                )}
              </div>
              {selectedEvent.extendedProps.reason && (
                <div style={{ fontSize: '13px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <span style={{ color: '#334155', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Motif</span>
                  <span style={{ color: '#1e293b' }}>{selectedEvent.extendedProps.reason}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
