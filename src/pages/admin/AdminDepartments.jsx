import React, { useState } from 'react';
import {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} from '../../features/api/absenceApi';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';

const deptSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  code: z.string().max(20, "Le code ne peut excéder 20 caractères").optional()
});

const emptyForm = { name: '', code: '' };

export default function AdminDepartments() {
  const { data: deptsData, isLoading } = useGetDepartmentsQuery({});
  const [createDept, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDept, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const depts = deptsData?.data || deptsData || [];

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, code: d.code || '' }); setError(''); setShowModal(true); };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer le département « ${name} » ?`)) {
      try { await deleteDept(id).unwrap(); }
      catch (err) { alert(err?.data?.message || 'Erreur suppression'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = deptSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      if (editing) await updateDept({ id: editing.id, ...form }).unwrap();
      else await createDept(form).unwrap();
      setShowModal(false);
    } catch (err) {
      const msgs = err?.data?.errors ? Object.values(err.data.errors).flat().join(' | ') : err?.data?.message;
      setError(msgs || 'Erreur enregistrement');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold flex items-center gap-2"><Building2 size={22} /> Gestion des Départements</h2>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nouveau département</button>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Code</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!depts.length ? (
                <tr><td colSpan="4" className="text-center text-muted py-8">Aucun département</td></tr>
              ) : depts.map(d => (
                <tr key={d.id}>
                  <td className="text-muted">#{d.id}</td>
                  <td className="font-semibold">{d.name}</td>
                  <td><span className="badge badge-info">{d.code || '-'}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => handleDelete(d.id, d.name)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h2>{editing ? `Modifier — ${editing.name}` : 'Nouveau département'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label className="form-label">Nom <span className="text-error">*</span></label>
                <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Informatique" />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Code</label>
                <input type="text" className="form-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="Ex: IT" maxLength={20} />
              </div>
              <div className="modal-footer pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
