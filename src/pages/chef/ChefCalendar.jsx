import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useGetTeamCalendarQuery } from '../../features/api/absenceApi';
import { Clock, CheckCircle } from 'lucide-react';

export default function ChefCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);
  
  // Format for the API: "YYYY-MM"
  const monthStr = currentDate.toISOString().slice(0, 7); 
  const { data, isLoading } = useGetTeamCalendarQuery({ month: monthStr });

  const absences = Array.isArray(data) ? data : (data?.data || []);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = absences.map(req => {
    // FullCalendar end date is exclusive, so we add 1 day for inclusive rendering
    const endDate = new Date(req.end_date);
    endDate.setDate(endDate.getDate() + 1);
    
    const isPending = req.status === 'pending';
    const baseColor = req.absence_type?.color || '#6366f1';

    return {
      id: req.id,
      title: `${req.user?.name} - ${req.absence_type?.name}${isPending ? ' (En attente)' : ''}`,
      start: req.start_date,
      end: endDate.toISOString().split('T')[0],
      backgroundColor: isPending ? '#f59e0b' : baseColor,
      borderColor: 'transparent',
      textColor: '#fff',
      classNames: isPending ? ['event-pending'] : [],
      extendedProps: {
        userId: req.user?.id,
        userName: req.user?.name,
        type: req.absence_type?.name,
        days: req.days_count,
        start: req.start_date,
        end: req.end_date,
        reason: req.reason,
        status: req.status,
        color: isPending ? '#f59e0b' : baseColor
      }
    };
  });

  const handleDatesSet = (dateInfo) => {
    // Extract the middle of the view (which represents the current loaded month)
    const midDate = new Date(dateInfo.view.currentStart.getTime() + (dateInfo.view.currentEnd.getTime() - dateInfo.view.currentStart.getTime()) / 2);
    const newMonthStr = midDate.toISOString().slice(0, 7);
    if (newMonthStr !== monthStr) {
      setCurrentDate(midDate);
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Calendrier de l'équipe</h2>
        <div className="flex gap-4 text-sm items-center text-muted">
          <span className="flex items-center gap-2">
            <span style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#f59e0b', display: 'inline-block' }}></span>
            En attente
          </span>
          <span className="flex items-center gap-2">
            <span style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: '#10b981', display: 'inline-block' }}></span>
            Approuvée
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        {isLoading && <div className="loader absolute z-10 top-4 right-4"><div className="spinner"></div></div>}
        
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locales={[frLocale]}
          locale="fr"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          height="auto"
          datesSet={handleDatesSet}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
          }}
          displayEventTime={false} // Since absences are full days
        />
      </div>

      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Détails de l'absence</h2>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>&times;</button>
            </div>
            <div className="p-4 bg-gray-50 rounded mb-4" style={{ background: 'var(--primary-bg)', borderRadius: 'var(--radius)' }}>
              <div className="mb-2">
                <strong className="text-muted block text-xs uppercase mb-1">Employé</strong>
                <span className="font-semibold">{selectedEvent.extendedProps.userName}</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted block text-xs uppercase mb-1">Période</strong>
                <span>{selectedEvent.extendedProps.start} au {selectedEvent.extendedProps.end} ({selectedEvent.extendedProps.days} jours)</span>
              </div>
              <div className="mb-2">
                <strong className="text-muted block text-xs uppercase mb-1">Type d'absence</strong>
                <span className="badge" style={{ backgroundColor: selectedEvent.extendedProps.color, color: '#fff' }}>
                  {selectedEvent.extendedProps.type}
                </span>
              </div>
              <div className="mb-2">
                <strong className="text-muted block text-xs uppercase mb-1">Statut</strong>
                {selectedEvent.extendedProps.status === 'pending' ? (
                  <span className="badge badge-warning flex items-center gap-1" style={{ display: 'inline-flex' }}>
                    <Clock size={13} /> En attente de validation
                  </span>
                ) : (
                  <span className="badge badge-success flex items-center gap-1" style={{ display: 'inline-flex' }}>
                    <CheckCircle size={13} /> Approuvée
                  </span>
                )}
              </div>
              {selectedEvent.extendedProps.reason && (
                <div>
                  <strong className="text-muted block text-xs uppercase mb-1">Motif</strong>
                  <p className="text-sm">{selectedEvent.extendedProps.reason}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
