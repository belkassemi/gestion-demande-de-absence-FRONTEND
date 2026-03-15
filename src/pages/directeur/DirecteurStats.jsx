import React, { useState } from 'react';
import { useGetDirecteurStatisticsQuery } from '../../features/api/absenceApi';
import { PieChart, Pie, Tooltip as RechartsTooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Activity, ClipboardList, CheckCircle } from 'lucide-react';

export default function DirecteurStats() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: stats, isLoading } = useGetDirecteurStatisticsQuery({ year });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (!stats) return <div className="alert alert-error">Erreur de chargement.</div>;

  const COLORS = ['#519275', '#3D6E58', '#6BAA8D', '#10B981', '#F59E0B', '#EF4444'];

  const typeData = Object.entries(stats.by_type || {}).map(([type, count]) => ({
    name: `Type ${type}`, value: count
  }));

  const monthData = Object.entries(stats.monthly_trend || {}).map(([month, count]) => ({
    name: month.split('-')[1], Absences: count
  }));

  const totalProcessed = (stats.total_approved || 0) + (stats.total_rejected || 0);
  const approvalRate = totalProcessed > 0 ? Math.round(((stats.total_approved || 0) / totalProcessed) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Statistiques Globales ({year})</h2>
        <input 
          type="number" 
          className="form-input" 
          style={{ width: '100px' }}
          value={year} 
          onChange={e => setYear(e.target.value)} 
        />
      </div>

      <div className="grid-3 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList size={28} className="text-gray-400" />
            <div className="stat-label flex-1">Total Demandes</div>
          </div>
          <div className="stat-value">{stats.total_requests || 0}</div>
        </div>
        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} className="text-white opacity-80" />
            <div className="stat-label flex-1 text-white opacity-90">Taux d'Approbation</div>
          </div>
          <div className="stat-value text-white">{approvalRate}%</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={28} className="text-[var(--info)] opacity-80" />
            <div className="stat-label flex-1">Tendance</div>
          </div>
          <div className="stat-value flex items-center gap-2">
            {stats.monthly_trend && Object.keys(stats.monthly_trend).length > 0 ? '↗ Active' : '-'}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm text-center">Répartition par Type d'Absence</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                  {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4 text-sm text-center">Évolution Mensuelle (Valilées)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData} margin={{ top: 20, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip cursor={{ fill: 'var(--primary-bg)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }} />
                <Bar dataKey="Absences" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
