import React, { useState } from 'react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetDepartmentsQuery,
  useGetServicesQuery,
} from '../../features/api/absenceApi';

const ROLES = [
  { value: 'employee',    label: 'Employé' },
  { value: 'chef_service', label: 'Chef de Service' },
  { value: 'directeur',   label: 'Directeur Général' },
  { value: 'admin',       label: 'Administrateur' },
];

import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().optional(),
  role: z.string().min(1, "Rôle obligatoire")
}).superRefine((data, ctx) => {
  // We need context to know if we are creating or editing, so we'll do password check manually inside the submit handler 
  // or pass an indicator. Let's do it in handleSubmit.
});

const ROLE_BADGE_COLOR = {
  employee:    'badge-info',
  chef_service: 'badge-warning',
  directeur:   'badge-primary',
  admin:       'badge-error',
};

const emptyForm = { name: '', email: '', password: '', role: 'employee', department_id: '', service_id: '', chef_service_id: '' };

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading } = useGetUsersQuery({ role: roleFilter, page });
  const { data: depts } = useGetDepartmentsQuery({});
  const { data: services } = useGetServicesQuery({});
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  // Users list may be paginated or a plain array depending on backend
  const users = usersData?.data || usersData || [];
  const lastPage = usersData?.last_page || 1;

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      department_id: u.department_id || '',
      service_id: u.service_id || '',
      chef_service_id: u.chef_service_id || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer l'utilisateur « ${name} » ?`)) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Zod validation
    const result = userSchema.safeParse(form);
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      return;
    }

    if (!editingUser && (!form.password || form.password.length < 4)) {
      setFormError("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }
    
    if (editingUser && form.password && form.password.length < 4) {
      setFormError("Le mot de passe doit contenir au moins 4 caractères");
      return;
    }

    const payload = { ...form };
    if (!payload.department_id) delete payload.department_id;
    if (!payload.service_id) delete payload.service_id;
    if (!payload.chef_service_id) delete payload.chef_service_id;
    if (!payload.password) delete payload.password;
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, ...payload }).unwrap();
      } else {
        await createUser(payload).unwrap();
      }
      setShowModal(false);
    } catch (err) {
      const msgs = err?.data?.errors ? Object.values(err.data.errors).flat().join(' | ') : err?.data?.message;
      setFormError(msgs || 'Erreur lors de l\'enregistrement');
    }
  };

  const chefServiceUsers = (usersData?.data || usersData || []).filter(u => u.role === 'chef_service');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Gestion des Utilisateurs</h2>
        <div className="flex gap-3 items-center">
          <select className="form-input text-sm" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">Tous les rôles</option>
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <button className="btn btn-primary" onClick={openCreate}>+ Nouvel Utilisateur</button>
        </div>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Département</th>
                <th>Service</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!users.length ? (
                <tr><td colSpan="7" className="text-center text-muted py-8">Aucun utilisateur trouvé</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td className="text-muted">#{u.id}</td>
                  <td className="font-semibold">{u.name}</td>
                  <td className="text-muted">{u.email}</td>
                  <td><span className={`badge ${ROLE_BADGE_COLOR[u.role] || 'badge-info'}`}>{ROLES.find(r => r.value === u.role)?.label || u.role}</span></td>
                  <td className="text-muted">{u.department?.name || '-'}</td>
                  <td className="text-muted">{u.service?.name || '-'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(u)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '.5rem' }} onClick={() => handleDelete(u.id, u.name)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Précédent</button>
            <span className="text-sm text-muted">Page {page} / {lastPage}</span>
            <button className="btn btn-secondary btn-sm" disabled={page === lastPage} onClick={() => setPage(p => p + 1)}>Suivant</button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h2>{editingUser ? `Modifier — ${editingUser.name}` : 'Créer un utilisateur'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {formError && <div className="alert alert-error mb-4">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nom complet <span className="text-error">*</span></label>
                  <input type="text" className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email <span className="text-error">*</span></label>
                  <input type="email" className="form-input" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} disabled={!!editingUser} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mot de passe {editingUser ? '(laisser vide)' : <span className="text-error">*</span>}</label>
                  <input type="password" className="form-input" minLength={8} required={!editingUser} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rôle <span className="text-error">*</span></label>
                  <select className="form-input" required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Département</label>
                  <select className="form-input" value={form.department_id} onChange={e => setForm({ ...form, department_id: e.target.value })}>
                    <option value="">Aucun</option>
                    {(depts?.data || depts || []).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Service</label>
                  <select className="form-input" value={form.service_id} onChange={e => setForm({ ...form, service_id: e.target.value })}>
                    <option value="">Aucun</option>
                    {(services?.data || services || []).filter(s => !form.department_id || s.department_id == form.department_id).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                {form.role === 'employee' && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Chef de Service</label>
                    <select className="form-input" value={form.chef_service_id} onChange={e => setForm({ ...form, chef_service_id: e.target.value })}>
                      <option value="">Aucun</option>
                      {chefServiceUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer pt-4" style={{ borderTop: '1px solid var(--border)', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? 'Enregistrement...' : (editingUser ? 'Mettre à jour' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
