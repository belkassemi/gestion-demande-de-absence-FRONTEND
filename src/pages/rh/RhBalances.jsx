import React, { useState } from 'react';
import { useGetEmployeeBalancesQuery } from '../../features/api/absenceApi';

export default function RhBalances() {
  const [departmentId, setDepartmentId] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching } = useGetEmployeeBalancesQuery({ department_id: departmentId, search });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const balances = data?.data || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Soldes des congés employés</h2>
        <div className="flex gap-3">
          <input 
            type="text" 
            className="form-input" 
            placeholder="Rechercher nom..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            disabled={isFetching}
          />
          <input 
            type="number" 
            className="form-input" 
            placeholder="ID Dép." 
            style={{ width: '100px' }}
            value={departmentId} 
            onChange={e => setDepartmentId(e.target.value)} 
            disabled={isFetching}
          />
        </div>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employé</th>
              <th>Département</th>
              <th>Jours Pris (Année)</th>
              <th>Jours En Attente</th>
            </tr>
          </thead>
          <tbody>
            {balances.length === 0 ? (
              <tr><td colSpan="5" className="text-center text-muted py-8">Aucun employé trouvé</td></tr>
            ) : balances.map(emp => (
               <tr key={emp.id}>
                 <td>#{emp.id}</td>
                 <td className="font-semibold">{emp.name}</td>
                 <td className="text-muted text-xs">{emp.department?.name || '-'}</td>
                 <td className="font-bold text-primary">{emp.approved_days} j</td>
                 <td className="text-warning">{emp.pending_days} j</td>
               </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
