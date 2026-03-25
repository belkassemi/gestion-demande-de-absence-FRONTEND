import React, { useState } from 'react';
import { useGetRhStatisticsQuery, useGetExportUrlQuery } from '../../features/api/absenceApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, ClipboardList, CheckCircle, XCircle } from 'lucide-react';

export default function RhReports() {
  const [period, setPeriod] = useState('year'); // 'month' or 'year'
  const { data: stats, isLoading } = useGetRhStatisticsQuery({ period });
  
  // To download, we just use a normal window.open since it returns a CSV download stream
  // We can construct the URL manually if we have the token
  const handleExport = () => {
    const token = localStorage.getItem('absence_token');
    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/rh/reports/export?token=${token}`;
    window.open(url, '_blank');
  };

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (!stats) return <div className="alert alert-error">Erreur de chargement.</div>;

  // Prepare data for recharts
  const chartData = Object.entries(stats.by_department || {}).map(([dept, count]) => ({
    name: dept || 'Inconnu',
    Absences: count
  }));

  const typeData = Object.entries(stats.by_type || {}).map(([type, count]) => ({
    name: `Type ${type}`,
    Demandes: count
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Rapports & Statistiques (Niveau 2)</h2>
        <div className="flex gap-3">
          <select className="form-input" value={period} onChange={e => setPeriod(e.target.value)}>
             <option value="month">Ce mois</option>
             <option value="year">Cette année</option>
          </select>
          <button className="btn btn-secondary flex items-center gap-2" onClick={handleExport}>
            <Download size={16} /> Exporter CSV
          </button>
        </div>
      </div>

      <div className="grid-3 mb-6">
        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList size={28} className="opacity-80" color="white" />
            <div className="stat-label flex-1 text-white opacity-90">Total Demandes Période</div>
          </div>
          <div className="stat-value text-white">{stats.total_requests}</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} className="text-[var(--success)] opacity-80" />
            <div className="stat-label flex-1">Total Approuvées</div>
          </div>
          <div className="stat-value text-success" style={{ color: 'var(--success)' }}>{stats.total_approved}</div>
        </div>
         <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={28} className="text-[var(--error)] opacity-80" />
            <div className="stat-label flex-1">Total Rejetées</div>
          </div>
          <div className="stat-value text-error" style={{ color: 'var(--error)' }}>{stats.total_rejected}</div>
        </div>
      </div>

      <div className="grid-2" style={{ margin: '2rem 0' }}>
         <div className="card">
           <h3 className="font-semibold mb-4 text-sm">Absences par Département</h3>
           <div style={{ height: '300px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <Tooltip cursor={{ fill: 'var(--primary-bg)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                 <Bar dataKey="Absences" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>

         <div className="card">
           <h3 className="font-semibold mb-4 text-sm">Demandes par Type</h3>
           <div style={{ height: '300px' }}>
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={typeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                 <Tooltip cursor={{ fill: 'var(--primary-bg)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                 <Bar dataKey="Demandes" fill="var(--info)" radius={[4, 4, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
      </div>
    </div>
  );
}
