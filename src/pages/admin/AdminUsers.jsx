import React, { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation, useGetDepartmentsQuery } from '../../features/api/absenceApi';

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState('');
  const { data: users, isLoading } = useGetUsersQuery({ role: roleFilter });
  const { data: depts } = useGetDepartmentsQuery();
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department_id: '', manager_id: '' });

  if (isLoading) return <div className="loader"><div className="spinner"></div></div>;

  const handleDelete = async (id, name) => {
    if (window.confirm(`Supprimer l'utilisateur ${name} ?`)) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createUser(form).unwrap();
      setShowModal(false);
      setForm({ name: '', email: '', password: '', role: 'employee', department_id: '', manager_id: '' });
    } catch (err) {
      alert(err?.data?.message || "Erreur de création");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold">Gestion des Utilisateurs</h2>
        <div className="flex gap-3 items-center">
          <select className="form-input text-sm" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
            <option value="">Tous les rôles</option>
            <option value="employee">Employés</option>
            <option value="chef">Chefs</option>
            <option value="rh">RH</option>
            <option value="directeur">Directeurs</option>
            <option value="admin">Admins</option>
          </select>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Nouvel Utilisateur</button>
        </div>
      </div>

      <div className="card text-sm" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Département</th>
              <th>Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!users?.length ? (
               <tr><td colSpan="7" className="text-center text-muted py-8">Aucun utilisateur</td></tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td className="font-semibold">{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-info">{u.role}</span></td>
                <td className="text-muted">{u.department?.name || '-'}</td>
                <td className="text-muted">{u.manager?.name || '-'}</td>
                <td>
                   <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id, u.name)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Créer un utilisateur</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                 <label className="form-label">Nom complet</label>
                 <input type="text" className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="form-group">
                 <label className="form-label">Email</label>
                 <input type="email" className="form-input" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-group">
                 <label className="form-label">Mot de passe</label>
                 <input type="password" className="form-input" required minLength={8} value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <select className="form-input" required value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="employee">Employé</option>
                    <option value="chef">Chef de Division</option>
                    <option value="rh">Ressources Humaines</option>
                    <option value="directeur">Directeur Général</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Département (Optionnel)</label>
                  <select className="form-input" value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                    <option value="">Aucun</option>
                    {depts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer pt-4 border-t" style={{ borderTop: '1px solid var(--border)' }}>
                 <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                 <button type="submit" className="btn btn-primary" disabled={isCreating}>Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
