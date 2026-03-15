import React, { useState } from 'react';
import { useGetTeamCalendarQuery } from '../../features/api/absenceApi';
import StatusBadge from '../../components/StatusBadge';

export default function ChefCalendar() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const { data, isLoading, isFetching } = useGetTeamCalendarQuery({ month });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const absences = data?.data || [];
  
  // Basic list view for calendar data. In a real app we'd use react-big-calendar or similar.
  // The PRD specifies a team calendar view.

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Calendrier de l'équipe</h2>
        <input 
          type="month" 
          className="form-input" 
          style={{ width: 'auto' }}
          value={month} 
          onChange={e => setMonth(e.target.value)} 
          disabled={isFetching}
        />
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Type</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Jours</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {absences.length === 0 ? (
              <tr><td colSpan="6" className="text-center text-muted py-8">Aucune absence approuvée ce mois-ci</td></tr>
            ) : absences.map(req => (
               <tr key={req.id}>
                 <td className="font-semibold">{req.user?.name}</td>
                 <td>{req.absence_type?.name}</td>
                 <td>{req.start_date}</td>
                 <td>{req.end_date}</td>
                 <td>{req.days_count}</td>
                 <td><StatusBadge status={req.status} /></td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
