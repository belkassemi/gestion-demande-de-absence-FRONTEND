/* eslint-disable react-hooks/incompatible-library */
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAbsenceTypesQuery, useCreateRequestMutation } from '../../features/api/absenceApi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Paperclip, Clock, ArrowLeft, Flag, UploadCloud } from 'lucide-react';

const requestSchema = z
  .object({
    absence_type_id: z.string().min(1, "Veuillez sélectionner un type d'absence"),
    start_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date de début invalide'),
    end_date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Date de fin invalide'),
    reason: z.string().optional(),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    message: 'La date de fin doit être postérieure ou égale à la date de début',
    path: ['end_date'],
  });

export default function EmployeeRequestForm() {
  const { data: types, isLoading: loadingTypes } = useGetAbsenceTypesQuery();
  const [createRequest, { isLoading: isSubmitting }] = useCreateRequestMutation();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(requestSchema),
    defaultValues: { absence_type_id: '', start_date: '', end_date: '', reason: '' },
  });

  const watchedTypeId = form.watch('absence_type_id');
  const watchedStart = form.watch('start_date');
  const watchedEnd = form.watch('end_date');

  const [documentFile, setDocumentFile] = React.useState(null);

  const selectedType = useMemo(() => {
    if (!types || !watchedTypeId) return null;
    return types.find((t) => t.id.toString() === watchedTypeId.toString());
  }, [types, watchedTypeId]);

  const calcDays = () => {
    if (!watchedStart || !watchedEnd) return 0;
    const start = new Date(watchedStart);
    const end = new Date(watchedEnd);
    if (end < start) return 0;
    let count = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) count++;
    }
    return count;
  };

  const days = calcDays();

  const onSubmit = async (data) => {
    if (selectedType?.requires_document && !documentFile) {
      toast.error("Un justificatif est obligatoire pour ce type d'absence.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('absence_type_id', data.absence_type_id);
      formData.append('start_date', data.start_date);
      formData.append('end_date', data.end_date);
      if (data.reason) formData.append('reason', data.reason);
      if (documentFile) formData.append('document', documentFile);

      await createRequest(formData).unwrap();
      toast.success('Demande soumise avec succès !');
      navigate('/employee');
    } catch (err) {
      toast.error(err?.data?.message || err?.data?.error || err.message || 'Erreur lors de la création de la demande');
    }
  };

  if (loadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="loader"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <button
        className="flex items-center gap-2 text-sm mb-6 text-slate-500 hover:text-slate-900 font-medium transition-colors"
        onClick={() => navigate('/employee')}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
        
        {/* Modern Premium Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-100 flex-shrink-0" style={{ backgroundColor: '#F8FAFC' }}>
            <Flag size={20} className="text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Soumettre une demande
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Remplissez les informations concernant votre absence
            </p>
          </div>
        </div>

        <div className="pt-8 pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="absence-form">

              {/* Type d'absence */}
              <div style={{ marginBottom: '1.75rem' }}>
                <FormField
                  control={form.control}
                  name="absence_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                        Type d'absence <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                            <SelectValue placeholder="Sélectionner un type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent style={{ padding: '0.5rem' }}>
                          {types?.map((t) => (
                            <SelectItem key={t.id} value={t.id.toString()} style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '0.5rem' }}>
                              <div className="flex items-center gap-2">
                                {t.name} {t.requires_document ? <span className="text-xs text-slate-400 ml-1">(Justificatif requis)</span> : ''}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedType && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '12px', fontWeight: 500, color: '#475569', background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: selectedType.color }} />
                          Sélectionné : {selectedType.name}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Dates Grid */}
              <div style={{ marginBottom: '1.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <CalendarDays size={14} style={{ color: '#94a3b8' }} />
                        Date de début <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" className="h-11 rounded-xl border-slate-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <CalendarDays size={14} style={{ color: '#94a3b8' }} />
                        Date de fin <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" min={watchedStart} className="h-11 rounded-xl border-slate-200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Days Counter — appears when both dates are selected */}
              {watchedStart && watchedEnd && days >= 0 && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '14px 20px',
                    borderRadius: '14px',
                    background: days === 0
                      ? '#fef2f2'
                      : days <= 3
                      ? '#eff6ff'
                      : '#f0fdf4',
                    border: `1.5px solid ${days === 0 ? '#fecaca' : days <= 3 ? '#bfdbfe' : '#bbf7d0'}`,
                  }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: days === 0 ? '#fee2e2' : days <= 3 ? '#dbeafe' : '#dcfce7',
                      flexShrink: 0,
                    }}>
                      <Clock size={20} style={{ color: days === 0 ? '#ef4444' : days <= 3 ? '#3b82f6' : '#22c55e' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '2px' }}>
                        Durée de l'absence
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                        {days === 0
                          ? 'Aucun jour ouvrable sélectionné'
                          : `${days} jour${days > 1 ? 's' : ''} ouvrable${days > 1 ? 's' : ''}`}
                      </div>
                    </div>
                    {days > 0 && (
                      <div style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: days <= 3 ? '#1d4ed8' : '#15803d',
                        background: days <= 3 ? '#dbeafe' : '#dcfce7',
                        whiteSpace: 'nowrap',
                      }}>
                        {days}j
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Document upload */}
              {selectedType && (
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '4px' }}>
                    Télécharger un document
                  </label>
                  <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                    Faites glisser et déposez un document pour appuyer votre demande.{' '}
                    {selectedType.requires_document && <span style={{ color: '#ef4444', fontWeight: 500 }}>Requis pour cette absence.</span>}
                  </p>

                  <div style={{ position: 'relative', border: '2px dashed #e2e8f0', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                    />
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <UploadCloud size={22} style={{ color: '#94a3b8' }} />
                    </div>
                    <p style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px', marginBottom: '4px' }}>Choisissez un fichier ou faites-le glisser ici.</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>txt, docx, pdf, jpeg, png — Jusqu'à 10 MB</p>

                    {documentFile ? (
                      <div style={{ marginTop: '16px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 20 }}>
                        <Paperclip size={14} style={{ color: 'var(--primary)' }} />
                        <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{documentFile.name}</span>
                        <button type="button" onClick={() => setDocumentFile(null)} style={{ marginLeft: '8px', color: '#94a3b8', fontWeight: 700, border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '16px', padding: '8px 16px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                        Parcourir les fichiers
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div style={{ marginBottom: '1.75rem' }}>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Précisez la raison détaillée de votre demande ici!"
                          rows={4}
                          className="resize-none rounded-xl border-slate-200"
                          style={{ padding: '16px' }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/employee')}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                  style={{ padding: '0 1.5rem', height: '2.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  Annuler
                </Button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { form.reset(); setDocumentFile(null); }}
                    disabled={isSubmitting}
                    className="rounded-xl border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                    style={{ padding: '0 1.5rem', height: '2.75rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                  >
                    Réinitialiser
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !watchedTypeId || days <= 0}
                    className="rounded-xl font-semibold transition-colors border-none"
                    style={{ padding: '0 1.5rem', height: '2.75rem', backgroundColor: '#111827', color: 'white', boxShadow: '0 4px 6px -1px rgba(17,24,39,0.1)' }}
                  >
                    {isSubmitting ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
                        Envoi...
                      </span>
                    ) : 'Soumettre'}
                  </Button>
                </div>
              </div>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
