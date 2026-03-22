import React, { useState } from 'react';
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetDepartmentsQuery,
  useGetUsersQuery,
} from '../../features/api/absenceApi';
import { FolderOpen, Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  department_id: z.string().min(1, "Le département est obligatoire"),
});

const emptyForm = { name: '', department_id: '', chef_service_id: '' };

export default function AdminServices() {
  const { data: svcData, isLoading } = useGetServicesQuery({});
  const { data: deptsData } = useGetDepartmentsQuery({});
  const { data: usersData } = useGetUsersQuery({ role: 'chef_service' });
  const [createSvc, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateSvc, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteSvc] = useDeleteServiceMutation();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const services = svcData?.data || svcData || [];
  const depts = deptsData?.data || deptsData || [];
  const chefs = usersData?.data || usersData || [];

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, department_id: s.department_id || '', chef_service_id: s.chef_service_id || '' }); setError(''); setShowModal(true); };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer le service « ${name} » ?`)) {
      try { await deleteSvc(id).unwrap(); }
      catch (err) { alert(err?.data?.message || 'Erreur suppression'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = serviceSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    const payload = { ...form };
    if (!payload.chef_service_id) delete payload.chef_service_id;
    try {
      if (editing) await updateSvc({ id: editing.id, ...payload }).unwrap();
      else await createSvc(payload).unwrap();
      setShowModal(false);
    } catch (err) {
      const msgs = err?.data?.errors ? Object.values(err.data.errors).flat().join(' | ') : err?.data?.message;
      setError(msgs || 'Erreur enregistrement');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold flex items-center gap-2"><FolderOpen size={22} /> Gestion des Services</h2>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nouveau service</button>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Département</th>
                <th>Chef de Service</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!services.length ? (
                <tr><td colSpan="5" className="text-center text-muted py-8">Aucun service</td></tr>
              ) : services.map(s => (
                <tr key={s.id}>
                  <td className="text-muted">#{s.id}</td>
                  <td className="font-semibold">{s.name}</td>
                  <td className="text-muted">{s.department?.name || depts.find(d => d.id == s.department_id)?.name || '-'}</td>
                  <td className="text-muted">{s.chef_service?.name || chefs.find(c => c.id == s.chef_service_id)?.name || <span className="text-muted italic">Non assigné</span>}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => handleDelete(s.id, s.name)}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h2>{editing ? `Modifier — ${editing.name}` : 'Nouveau service'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label className="form-label">Nom du service <span className="text-error">*</span></label>
                <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Service Développement" />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Département <span className="text-error">*</span></label>
                <select className="form-input" required value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                  <option value="">Sélectionner...</option>
                  {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Chef de Service</label>
                <select className="form-input" value={form.chef_service_id} onChange={e => setForm({ ...form, chef_service_id: e.target.value })}>
                  <option value="">Non assigné</option>
                  {chefs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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
