import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/api/absenceApi';
import { setCredentials } from '../features/auth/authSlice';
import { Mail, Lock, LogIn } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(4, "Le mot de passe doit contenir au moins 4 caractères")
});

export default function LoginPage() {
  const [email, setEmail]    = useState('');
  const [password, setPwd]   = useState('');
  const [errorMsg, setError] = useState('');
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Zod validation
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      
      const home = { 
        employee: '/employee', 
        chef: '/chef', 
        rh: '/rh', 
        directeur: '/directeur', 
        admin: '/admin' 
      };
      navigate(home[data.user.role] || '/');
    } catch (err) {
      setError(err?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-bg)' }}>
      <div className="card shadow-lg" style={{ width: '100%', maxWidth: '420px', margin: '1rem', padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <img src="/logo-fr.png" alt="GesAbsences Logo" style={{ height: '60px', margin: '0 auto 1rem', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>GesAbsences</h1>
          <p className="text-muted text-sm mt-2">Connectez-vous à votre espace professionnel</p>
        </div>

        {errorMsg && (
          <div className="alert alert-error mb-5">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="form-label font-medium text-gray-700">Email professionnel</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="prenom.nom@entreprise.com" 
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="form-group mb-6">
            <label className="form-label font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={password} 
                onChange={e => setPwd(e.target.value)} 
                required 
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary w-full flex justify-center items-center gap-2 py-2.5 text-base" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></span>
                Connexion...
              </>
            ) : (
              <>
                <LogIn size={20} /> Se connecter
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
