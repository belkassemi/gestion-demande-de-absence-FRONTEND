import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ArrowRight, Mail, Lock, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import { useLoginMutation } from '../features/api/absenceApi';
import { setCredentials } from '../features/auth/authSlice';

import bgImage from '../assets/1-PERSPECTIVE EXTERIERURE 1.jpg';
import logo from '/logo-fr.png';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginApi] = useLoginMutation();

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await loginApi({ email, password }).unwrap();
      dispatch(setCredentials({ user: data.user, token: data.token }));
      const ROLE_HOME = {
        employee: '/employee',
        chef: '/chef',
        rh: '/rh',
        directeur: '/directeur',
        admin: '/admin'
      };
      navigate(ROLE_HOME[data.user.role] || '/employee');
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Poppins, Inter, sans-serif',
        backgroundImage: `url('${bgImage.replace(/\\/g, "/")}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.58)', zIndex: 0 }} />

      {/* Navbar */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '28px 56px'
      }}>
        <img src={logo} alt="Logo" style={{ height: '68px', width: 'auto', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }} />
        <div style={{ display: 'flex', gap: '36px' }}>
          {['Accueil', 'A propos', 'Contactez-nous'].map((label, i) => (
            <button
              key={label}
              onClick={() => navigate(i === 0 ? '/' : i === 1 ? '/about' : '/contact')}
              style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
                fontSize: '14px', fontWeight: '600', letterSpacing: '0.03em',
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'color 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 24px'
      }}>

        {/* Hero Text */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', maxWidth: '860px',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          opacity: showForm ? 0 : 1,
          transform: showForm ? 'translateY(-32px) scale(0.97)' : 'translateY(0) scale(1)',
          pointerEvents: showForm ? 'none' : 'auto'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: '800', color: '#fff',
            lineHeight: 1.15, marginBottom: '24px',
            textShadow: '0 2px 24px rgba(0,0,0,0.4)',
            letterSpacing: '-0.02em'
          }}>
            Système de Gestion<br />des Absences
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.82)', fontSize: '17px',
            lineHeight: 1.8, maxWidth: '680px', marginBottom: '44px',
            fontWeight: '400'
          }}>
            Plateforme moderne et intuitive pour la gestion des demandes d'absences et autorisations de sortie.
            Simplifiez le processus de demande, suivez l'historique et gérez les approbations en temps réel.
          </p>

          {/* ── THE BUTTON ── */}
          <button
            onClick={() => setShowForm(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)',
              color: '#0f172a',
              border: 'none',
              borderRadius: '50px',
              fontSize: '15px', fontWeight: '700',
              letterSpacing: '0.02em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)';
            }}
          >
            <span>Se connecter</span>
            <div style={{
              width: '32px', height: '32px',
              backgroundColor: '#0f172a', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ArrowRight style={{ width: '16px', height: '16px', color: '#fff' }} />
            </div>
          </button>
        </div>

        {/* ── LOGIN FORM ── */}
        <div style={{
          position: 'absolute',
          width: '100%', maxWidth: '440px',
          padding: '0 20px',
          transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          opacity: showForm ? 1 : 0,
          transform: showForm ? 'translateY(0)' : 'translateY(40px)',
          pointerEvents: showForm ? 'auto' : 'none'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '24px',
            padding: '40px 36px',
            boxShadow: '0 32px 64px rgba(0,0,0,0.4), 0 2px 4px rgba(255,255,255,0.05) inset'
          }}>

            {/* Form Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
                  Connexion
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', marginTop: '6px', margin: '6px 0 0' }}>
                  Accédez à votre espace professionnel
                </p>
              </div>
              <button
                onClick={() => { setShowForm(false); setErrorMsg(''); }}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0
                }}
              >
                <X style={{ width: '15px', height: '15px' }} />
              </button>
            </div>

            {/* Error */}
            {errorMsg && (
              <div style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: '12px', padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: '10px',
                color: '#fca5a5', fontSize: '14px', marginBottom: '20px'
              }}>
                <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Email Field */}
              <div>
                <label style={{
                  display: 'block', fontSize: '13px', fontWeight: '600',
                  color: 'rgba(255,255,255,0.8)', marginBottom: '8px', letterSpacing: '0.02em'
                }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px', height: '18px', color: 'rgba(255,255,255,0.4)'
                  }} />
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="prenom.nom@entreprise.com"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '13px 16px 13px 46px',
                      color: '#fff', fontSize: '14px',
                      fontFamily: 'inherit', outline: 'none',
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.target.style.background = 'rgba(255,255,255,0.06)';
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em' }}>
                    Mot de passe
                  </label>
                  <button type="button" style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
                    fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit'
                  }}>
                    Mot de passe oublié?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{
                    position: 'absolute', left: '16px', top: '50%',
                    transform: 'translateY(-50%)',
                    width: '18px', height: '18px', color: 'rgba(255,255,255,0.4)'
                  }} />
                  <input
                    type={showPass ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      padding: '13px 48px 13px 46px',
                      color: '#fff', fontSize: '14px',
                      fontFamily: 'inherit', outline: 'none',
                      letterSpacing: showPass ? 'normal' : '0.15em',
                      transition: 'border-color 0.2s, background 0.2s'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                      e.target.style.background = 'rgba(255,255,255,0.06)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute', right: '14px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    {showPass ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '15px',
                  background: loading ? 'rgba(255,255,255,0.5)' : 'linear-gradient(135deg, #ffffff 0%, #e8eeff 100%)',
                  color: '#0f172a',
                  border: 'none', borderRadius: '14px',
                  fontSize: '15px', fontWeight: '700',
                  fontFamily: 'inherit', cursor: loading ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
              >
                {loading ? (
                  <>
                    <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight style={{ width: '18px', height: '18px' }} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
