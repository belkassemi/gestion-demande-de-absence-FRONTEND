import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAbsenceTypesQuery, useCreateRequestMutation } from '../../features/api/absenceApi';
import { z } from 'zod';

const requestSchema = z.object({
  absence_type_id: z.string().min(1, "Veuillez sélectionner un type d'absence"),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), "Date de début invalide"),
  end_date: z.string().refine(val => !isNaN(Date.parse(val)), "Date de fin invalide"),
  reason: z.string().optional()
}).refine(data => new Date(data.end_date) >= new Date(data.start_date), {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["end_date"]
});

export default function EmployeeRequestForm() {
  const { data: types, isLoading: loadingTypes } = useGetAbsenceTypesQuery();
  const [createRequest, { isLoading: isSubmitting }] = useCreateRequestMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    absence_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  
  const [document, setDocument] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedType = useMemo(() => {
    if (!types || !form.absence_type_id) return null;
    return types.find(t => t.id.toString() === form.absence_type_id.toString());
  }, [types, form.absence_type_id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocument(e.target.files[0]);
    } else {
      setDocument(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Zod Validation
    const result = requestSchema.safeParse(form);
    if (!result.success) {
      setErrorMsg(result.error.errors[0].message);
      return;
    }

    if (selectedType?.requires_document && !document) {
      setErrorMsg("Un justificatif est obligatoire pour ce type d'absence.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('absence_type_id', form.absence_type_id);
      formData.append('start_date', form.start_date);
      formData.append('end_date', form.end_date);
      if (form.reason) formData.append('reason', form.reason);
      // user_id is now inferred server-side from Auth::id()

      if (document) {
        formData.append('document', document);
      }

      await createRequest(formData).unwrap();
      navigate('/employee');
    } catch (err) {
      setErrorMsg(err?.data?.message || err?.data?.error || err.message || "Erreur lors de la création de la demande");
    }
  };

  if (loadingTypes) return <div className="loader"><div className="spinner"></div></div>;

  // Calcul jours (approximatif pour affichage, le vrai calcul est backend)
  const calcDays = () => {
    if (!form.start_date || !form.end_date) return 0;
    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    if (end < start) return 0;
    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) count++; // exclude weekends
    }
    return count;
  };

  const days = calcDays();

  return (
    <div className="card shadow-md" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
      <div className="mb-6 border-b pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h2 className="font-bold text-2xl" style={{ color: 'var(--primary-dark)' }}>Saisir une nouvelle demande</h2>
        <p className="text-muted text-sm mt-1">Veuillez remplir les informations concernant votre absence.</p>
      </div>
      
      {errorMsg && <div className="alert alert-error mb-5">{errorMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-5">
          <label className="form-label font-semibold">Type d'absence <span className="text-error">*</span></label>
          <select 
            className="form-input" 
            name="absence_type_id" 
            value={form.absence_type_id} 
            onChange={handleChange} 
            required
            style={{ 
              borderLeft: selectedType ? `4px solid ${selectedType.color}` : '1px solid var(--border)',
              backgroundColor: 'var(--surface)'
            }}
          >
            <option value="">Sélectionner un type...</option>
            {types?.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} {t.requires_document ? '(Justificatif requis)' : ''}
              </option>
            ))}
          </select>
          
          {selectedType && (
            <div className="mt-2 text-xs flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: selectedType.color }}></span>
              <span className="text-muted">Sélection : {selectedType.name}</span>
            </div>
          )}
        </div>

        <div className="grid-2 mb-5 gap-4">
          <div className="form-group">
            <label className="form-label font-semibold">Date de début <span className="text-error">*</span></label>
            <input 
              type="date" 
              className="form-input" 
              name="start_date" 
              value={form.start_date} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label font-semibold">Date de fin <span className="text-error">*</span></label>
            <input 
              type="date" 
              className="form-input" 
              name="end_date" 
              value={form.end_date} 
              onChange={handleChange} 
              required 
              min={form.start_date}
            />
          </div>
        </div>

        {days > 0 && (
          <div className="alert alert-info mb-5" style={{ background: 'var(--primary-bg)', color: 'var(--primary-dark)', borderColor: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Durée estimée : <strong>{days} jour(s) ouvrable(s)</strong></span>
          </div>
        )}

        {selectedType && selectedType.requires_document && (
           <div className="form-group mb-5 p-4 rounded bg-gray-50 border" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hover)' }}>
             <label className="form-label font-semibold flex items-center gap-2">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-error"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
               Justificatif obligatoire <span className="text-error">*</span>
             </label>
             <p className="text-xs text-muted mb-2">Un document (certificat médical, acte de naissance...) est requis pour ce type de congé.</p>
             <input 
               type="file" 
               className="form-input text-sm p-2" 
               accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
               onChange={handleFileChange}
               required
             />
           </div>
        )}

        {selectedType && !selectedType.requires_document && (
           <div className="form-group mb-5">
             <label className="form-label font-semibold">Document joint (Optionnel)</label>
             <input 
               type="file" 
               className="form-input text-sm p-2" 
               accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
               onChange={handleFileChange}
             />
           </div>
        )}

        <div className="form-group mb-6">
          <label className="form-label font-semibold">Motif (Optionnel)</label>
          <textarea 
            className="form-input" 
            name="reason" 
            value={form.reason} 
            onChange={handleChange} 
            placeholder="Précisez la raison de votre demande..."
            rows="3"
            style={{ resize: 'vertical' }}
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t" style={{ borderTop: '1px solid var(--border)' }}>
          <button type="button" className="btn btn-secondary px-6" onClick={() => navigate('/employee')} disabled={isSubmitting}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary px-6" disabled={isSubmitting || !form.absence_type_id || days <= 0}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></span>
                Envoi...
              </span>
            ) : 'Soumettre la demande'}
          </button>
        </div>
      </form>
    </div>
  );
}

