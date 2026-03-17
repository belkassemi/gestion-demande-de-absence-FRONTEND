import React, { useState } from 'react';
import { useGetUsersQuery, useCreateUserMutation, useDeleteUserMutation, useGetDepartmentsQuery } from '../../features/api/absenceApi';
import { Search, Plus, Trash2, Edit2, Shield, User, Briefcase, Mail, Building, Users } from 'lucide-react';

export default function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: users, isLoading } = useGetUsersQuery({ role: roleFilter });
  const { data: depts } = useGetDepartmentsQuery();
  
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee', department_id: '', manager_id: '' });

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="spinner"></div>
    </div>
  );

  const handleDelete = async (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${name} ? Cette action est irréversible.`)) {
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

  const filteredUsers = users?.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rh': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'directeur': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'chef': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      employee: 'Employé', chef: 'Chef de Div.', rh: 'RH', directeur: 'Directeur', admin: 'Admin'
    };
    return labels[role] || role;
  };

  return (
    <div className="animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-[var(--primary)]" size={28} />
            Gestion des Utilisateurs
          </h2>
          <p className="text-muted mt-1 text-sm">Gérez les accès, rôles et départements des collaborateurs.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Nouvel Utilisateur
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher par nom ou email..." 
            className="form-input w-full pl-10 bg-gray-50 border-gray-200 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Filtrer par rôle:</span>
          <select 
            className="form-input text-sm bg-gray-50 border-gray-200 focus:bg-white cursor-pointer" 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">Tous les rôles</option>
            <option value="employee">Employés</option>
            <option value="chef">Chefs de Division</option>
            <option value="rh">Ressources Humaines</option>
            <option value="directeur">Directeurs</option>
            <option value="admin">Administrateurs</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Département & Manager</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={48} className="text-gray-200 mb-3" />
                      <p className="text-lg font-medium text-gray-900">Aucun utilisateur trouvé</p>
                      <p className="text-sm mt-1">Essayez de modifier vos critères de recherche.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center font-bold shadow-sm">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            ID: #{u.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(u.role)}`}>
                        {u.role === 'admin' && <Shield size={12} className="mr-1" />}
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building size={14} className="text-gray-400" />
                          <span className="font-medium">{u.department?.name || <span className="text-gray-400 italic">Non assigné</span>}</span>
                        </div>
                        {u.manager && (
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User size={12} className="text-gray-400" />
                            Manager: {u.manager.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={isDeleting || u.id === 1} // Prevent deleting super admin
                          className={`p-2 rounded-lg transition-colors ${u.id === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50 hover:text-red-600'}`}
                          title={u.id === 1 ? "Impossible de supprimer l'admin principal" : "Supprimer cet utilisateur"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
          <span>{filteredUsers.length} utilisateur(s) trouvé(s)</span>
        </div>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={20} />
                </div>
                Ajouter un nouveau collaborateur
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="overflow-y-auto p-6">
              <div className="space-y-6">
                
                {/* Personal Info Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Informations Personnelles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        className="form-input w-full border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] rounded-lg shadow-sm" 
                        required 
                        placeholder="Ex: John Doe"
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                      />
                    </div>
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        className="form-input w-full border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] rounded-lg shadow-sm" 
                        required 
                        placeholder="john.doe@entreprise.com"
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>

                {/* Security Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 mt-2">Sécurité</h3>
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe temporaire <span className="text-red-500">*</span></label>
                    <input 
                      type="password" 
                      className="form-input w-full border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] rounded-lg shadow-sm" 
                      required 
                      minLength={8}
                      placeholder="Min. 8 caractères"
                      value={form.password} 
                      onChange={e => setForm({...form, password: e.target.value})} 
                    />
                    <p className="text-xs text-gray-500 mt-1">L'utilisateur pourra modifier ce mot de passe ultérieurement.</p>
                  </div>
                </div>

                {/* Role & Org Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2 mt-2">Rôle & Organisation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Briefcase size={14} className="text-gray-400"/>
                        Rôle Système <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="form-input w-full border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] rounded-lg shadow-sm" 
                        required 
                        value={form.role} 
                        onChange={e => setForm({...form, role: e.target.value})}
                      >
                        <option value="employee">Employé (Standard)</option>
                        <option value="chef">Chef de Division</option>
                        <option value="rh">Ressources Humaines</option>
                        <option value="directeur">Directeur Général</option>
                        <option value="admin">Administrateur Système</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Building size={14} className="text-gray-400"/>
                        Département
                      </label>
                      <select 
                        className="form-input w-full border-gray-300 focus:border-[var(--primary)] focus:ring-[var(--primary)] rounded-lg shadow-sm" 
                        value={form.department_id} 
                        onChange={e => setForm({...form, department_id: e.target.value})}
                      >
                        <option value="">-- Aucun département --</option>
                        {depts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end gap-3 bg-white sticky bottom-0">
                <button 
                  type="button" 
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors" 
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[var(--primary)] hover:bg-[var(--primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)] transition-all shadow-sm flex items-center gap-2" 
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <><span className="spinner border-t-white w-4 h-4 border-2"></span> Création...</>
                  ) : (
                    <><Plus size={16} /> Créer le compte</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
