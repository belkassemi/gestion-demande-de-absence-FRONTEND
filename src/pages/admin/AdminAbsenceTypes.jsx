import React, { useState } from 'react';
import {
  useGetAbsenceTypesQuery,
  useCreateAbsenceTypeMutation,
  useUpdateAbsenceTypeMutation,
  useDeleteAbsenceTypeMutation,
} from '../../features/api/absenceApi';
import { BookOpen, Plus, Pencil, Trash2, FileCheck } from 'lucide-react';
import { z } from 'zod';

const typeSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "La couleur doit être un code hexadécimal valide").optional()
});

const emptyForm = { name: '', color: '#519275', requires_document: false, is_active: true };

export default function AdminAbsenceTypes() {
  const { data: types, isLoading } = useGetAbsenceTypesQuery();
  const [createType, { isLoading: isCreating }] = useCreateAbsenceTypeMutation();
  const [updateType, { isLoading: isUpdating }] = useUpdateAbsenceTypeMutation();
  const [deleteType] = useDeleteAbsenceTypeMutation();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const typeList = Array.isArray(types) ? types : (types?.data || []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(''); setShowModal(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({ name: t.name, color: t.color || '#519275', requires_document: !!t.requires_document, is_active: t.is_active !== false });
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer le type « ${name} » ?`)) {
      try { await deleteType(id).unwrap(); }
      catch (err) { alert(err?.data?.message || 'Erreur: ce type est peut-être utilisé par des demandes existantes.'); }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = typeSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      if (editing) await updateType({ id: editing.id, ...form }).unwrap();
      else await createType(form).unwrap();
      setShowModal(false);
    } catch (err) {
      const msgs = err?.data?.errors ? Object.values(err.data.errors).flat().join(' | ') : err?.data?.message;
      setError(msgs || 'Erreur enregistrement');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold flex items-center gap-2"><BookOpen size={22} /> Types d'Absence</h2>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Nouveau type</button>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Couleur</th>
                <th>Nom</th>
                <th>Justificatif</th>
                <th>Statut</th>
                <th style={{ width: 130 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!typeList.length ? (
                <tr><td colSpan="6" className="text-center text-muted py-8">Aucun type d'absence</td></tr>
              ) : typeList.map(t => (
                <tr key={t.id}>
                  <td className="text-muted">#{t.id}</td>
                  <td>
                    <span style={{
                      display: 'inline-block', width: 20, height: 20,
                      borderRadius: '50%', backgroundColor: t.color || '#519275',
                      border: '1px solid rgba(0,0,0,0.1)', verticalAlign: 'middle'
                    }} title={t.color} />
                  </td>
                  <td className="font-semibold">{t.name}</td>
                  <td>
                    {t.requires_document
                      ? <span className="badge badge-warning flex items-center gap-1"><FileCheck size={12} /> Requis</span>
                      : <span className="text-muted">Non</span>}
                  </td>
                  <td>
                    {t.is_active !== false
                      ? <span className="badge badge-success">Actif</span>
                      : <span className="badge badge-error">Inactif</span>}
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => handleDelete(t.id, t.name)}><Trash2 size={14} /></button>
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
              <h2>{editing ? `Modifier — ${editing.name}` : 'Nouveau type d\'absence'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {error && <div className="alert alert-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-4">
                <label className="form-label">Nom <span className="text-error">*</span></label>
                <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Congé annuel" />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Couleur</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} style={{ width: 48, height: 36, padding: 2, borderRadius: 6, cursor: 'pointer', border: '1px solid var(--border)' }} />
                  <span className="text-muted text-sm">{form.color}</span>
                </div>
              </div>
              <div className="form-group mb-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.requires_document} onChange={e => setForm({ ...form, requires_document: e.target.checked })} />
                  <span className="form-label" style={{ margin: 0 }}>Justificatif obligatoire</span>
                </label>
              </div>
              <div className="form-group mb-4">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  <span className="form-label" style={{ margin: 0 }}>Type actif</span>
                </label>
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
