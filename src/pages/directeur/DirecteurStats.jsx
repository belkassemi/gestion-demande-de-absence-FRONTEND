import React, { useState } from 'react';
import { useGetDirecteurStatisticsQuery } from '../../features/api/absenceApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Activity, ClipboardList, TrendingUp } from 'lucide-react';

export default function DirecteurStats() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: stats, isLoading, isError } = useGetDirecteurStatisticsQuery({ year });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;
  if (isError || !stats) return <div className="alert alert-error">Erreur de chargement des statistiques.</div>;

  // Backend returns:
  // by_department: [{department, total, approved, total_days}]
  // by_type: [{type, count, days}]
  // monthly: [{month, count, days}]
  // top_employees: [{name, total_days}]

  const monthData = (stats.monthly || []).map(m => ({
    name: m.month?.split('-')[1] || m.month,
    Demandes: m.count,
    Jours: m.days,
  }));

  const totalAll = (stats.by_department || []).reduce((acc, d) => acc + (d.total || 0), 0);
  const totalApproved = (stats.by_department || []).reduce((acc, d) => acc + (d.approved || 0), 0);
  const approvalRate = totalAll > 0 ? Math.round((totalApproved / totalAll) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold" style={{ fontSize: '1.25rem' }}>Statistiques Globales</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted">Année :</label>
          <input
            type="number"
            className="form-input"
            style={{ width: '100px' }}
            value={year}
            min={2020}
            max={2030}
            onChange={e => setYear(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid-3 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList size={28} className="opacity-60" />
            <div className="stat-label flex-1">Total demandes ({year})</div>
          </div>
          <div className="stat-value">{totalAll}</div>
        </div>
        <div className="stat-card primary">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={28} className="opacity-80" />
            <div className="stat-label flex-1 text-white opacity-90">Taux d'approbation</div>
          </div>
          <div className="stat-value">{approvalRate}%</div>
        </div>
        <div className="stat-card" style={{ borderLeft: '4px solid var(--info)' }}>
          <div className="flex items-center gap-3 mb-2">
            <Activity size={28} style={{ color: 'var(--info)' }} />
            <div className="stat-label flex-1">Types distincts</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--info)' }}>{(stats.by_type || []).length}</div>
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="card mb-6">
        <h3 className="font-semibold mb-4 text-sm">Évolution mensuelle des demandes</h3>
        {monthData.length > 0 ? (
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  cursor={{ fill: 'var(--primary-bg)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow)' }}
                />
                <Bar dataKey="Demandes" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : <p className="text-muted text-sm">Aucune donnée pour {year}.</p>}
      </div>

      <div className="grid-2" style={{ gap: '1.5rem' }}>
        {/* By Department */}
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Par département</h3>
          {(stats.by_department || []).length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Département</th>
                  <th>Total</th>
                  <th>Approuvées</th>
                  <th>Jours</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_department.map((d, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{d.department}</td>
                    <td>{d.total}</td>
                    <td style={{ color: 'var(--success)' }}>{d.approved}</td>
                    <td className="font-bold">{d.total_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted text-sm">Aucune donnée.</p>}
        </div>

        {/* By Type */}
        <div className="card">
          <h3 className="font-semibold mb-4 text-sm">Par type d'absence</h3>
          {(stats.by_type || []).length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Demandes</th>
                  <th>Jours</th>
                </tr>
              </thead>
              <tbody>
                {stats.by_type.map((t, i) => (
                  <tr key={i}>
                    <td className="font-semibold">{t.type}</td>
                    <td>{t.count}</td>
                    <td className="font-bold">{t.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-muted text-sm">Aucune donnée.</p>}
        </div>
      </div>

      {/* Top Employees */}
      {(stats.top_employees || []).length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 className="font-semibold mb-4 text-sm">Top employés — jours d'absence approuvés ({year})</h3>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Employé</th>
                <th>Jours approuvés</th>
              </tr>
            </thead>
            <tbody>
              {stats.top_employees.map((e, i) => (
                <tr key={i}>
                  <td className="text-muted font-bold">{i + 1}</td>
                  <td className="font-semibold">{e.name}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{e.total_days} j</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
