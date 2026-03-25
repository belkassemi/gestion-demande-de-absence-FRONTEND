import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MapPin, 
    Phone, 
    Globe, 
    Clock,
    Send,
    ArrowLeft,
    CheckCircle
} from 'lucide-react';
import logoDark from '/dark_mode_urbaine_logo.png';
import buildingImage from '../assets/building-perspective.jpg';

export default function ContactPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nom: '', email: '', sujet: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const contactInfo = [
        { icon: MapPin, label: 'Adresse', value: 'Place de la Résistance, BP 800, Laayoune 70000', color: '#3b82f6' },
        { icon: Phone, label: 'Téléphone', value: '05 28 89 18 12', color: '#10b981' },
        { icon: Globe, label: 'Site Web', value: 'www.aulaayoune.ma', color: '#8b5cf6' },
        { icon: Clock, label: 'Horaires', value: 'Lun - Ven: 8h30 - 16h30', color: '#f59e0b' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Poppins, Inter, sans-serif' }}>

            {/* Hero Section */}
            <div style={{ position: 'relative', height: '40vh', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.4,
                    backgroundImage: `url('${buildingImage}')`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.97))'
                }}></div>

                {/* Navigation */}
                <nav style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '24px 64px', borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src={logoDark} alt="AULSH Logo" style={{ height: '56px', width: 'auto' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '40px' }}>
                        <button onClick={() => navigate('/')} style={{ color: 'rgba(255,255,255,0.7)', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer' }}>
                            ACCUEIL
                        </button>
                        <button onClick={() => navigate('/about')} style={{ color: 'rgba(255,255,255,0.7)', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer' }}>
                            À PROPOS
                        </button>
                        <button style={{ color: '#fff', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer' }}>
                            CONTACT
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '65%', padding: '0 16px', textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '300', color: '#fff', letterSpacing: '-0.02em', animation: 'slideUp 0.8s ease-out forwards', opacity: 0 }}>
                        Contactez-<span style={{ fontWeight: '700' }}>Nous</span>
                    </h1>
                    <div style={{ width: '80px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', marginTop: '24px', marginBottom: '16px', animation: 'fadeIn 1s ease-out 0.3s forwards', opacity: 0 }}></div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', lineHeight: '1.7', animation: 'slideUp 0.8s ease-out 0.4s forwards', opacity: 0 }}>
                        Nous sommes à votre écoute pour toute question ou demande d'information
                    </p>
                </div>
            </div>

            {/* Contact Info Cards - overlapping the hero */}
            <div style={{ padding: '0 32px', marginTop: '-60px', position: 'relative', zIndex: 20 }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        {contactInfo.map((info, idx) => (
                            <div key={info.label} style={{
                                backgroundColor: '#fff', borderRadius: '4px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                padding: '24px 20px',
                                animation: `slideUp 0.6s ease-out ${0.5 + (idx * 0.15)}s forwards`, opacity: 0
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', backgroundColor: info.color,
                                    borderRadius: '4px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', marginBottom: '16px'
                                }}>
                                    <info.icon style={{ width: '24px', height: '24px', color: '#fff' }} />
                                </div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                                    {info.label}
                                </p>
                                <p style={{ color: '#0f172a', fontWeight: '600', fontSize: '14px' }}>
                                    {info.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form + Map */}
            <div style={{ padding: '80px 32px 64px', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }}>

                        {/* Left - Form */}
                        <div style={{ animation: 'slideUp 0.8s ease-out 0.8s forwards', opacity: 0 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '300', color: '#0f172a', marginBottom: '8px' }}>
                                Envoyez-nous un <span style={{ fontWeight: '700' }}>message</span>
                            </h2>
                            <div style={{ width: '48px', height: '2px', backgroundColor: '#cbd5e1', marginBottom: '32px' }}></div>

                            {isSubmitted ? (
                                <div style={{
                                    backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                                    borderRadius: '4px', padding: '40px', textAlign: 'center'
                                }}>
                                    <CheckCircle style={{ width: '56px', height: '56px', color: '#10b981', margin: '0 auto 16px' }} />
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#14532d', marginBottom: '8px' }}>Message envoyé!</h3>
                                    <p style={{ color: '#15803d' }}>Nous vous répondrons dans les plus brefs délais.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                                Nom complet
                                            </label>
                                            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required
                                                placeholder="Votre nom"
                                                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit', borderRadius: '4px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                                Email
                                            </label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                                placeholder="votre@email.com"
                                                style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit', borderRadius: '4px' }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                            Sujet
                                        </label>
                                        <input type="text" name="sujet" value={formData.sujet} onChange={handleChange} required
                                            placeholder="Objet de votre message"
                                            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit', borderRadius: '4px' }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                                            Message
                                        </label>
                                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={6}
                                            placeholder="Votre message..."
                                            style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e2e8f0', fontSize: '14px', color: '#0f172a', outline: 'none', fontFamily: 'inherit', borderRadius: '4px', resize: 'vertical' }}
                                        ></textarea>
                                    </div>

                                    <button type="submit" style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '12px',
                                        padding: '14px 32px', backgroundColor: '#0f172a',
                                        color: '#fff', border: 'none', fontFamily: 'inherit',
                                        fontSize: '13px', fontWeight: '700', letterSpacing: '0.06em',
                                        cursor: 'pointer', borderRadius: '4px'
                                    }}>
                                        ENVOYER LE MESSAGE
                                        <Send style={{ width: '16px', height: '16px' }} />
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right - Map */}
                        <div style={{ animation: 'slideUp 0.8s ease-out 1s forwards', opacity: 0 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '300', color: '#0f172a', marginBottom: '8px' }}>
                                Notre <span style={{ fontWeight: '700' }}>Localisation</span>
                            </h2>
                            <div style={{ width: '48px', height: '2px', backgroundColor: '#cbd5e1', marginBottom: '32px' }}></div>

                            <div style={{ position: 'relative', height: '340px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    position: 'absolute', inset: 0, opacity: 0.3,
                                    backgroundImage: `url('${buildingImage}')`,
                                    backgroundSize: 'cover', backgroundPosition: 'center'
                                }}></div>
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexDirection: 'column', textAlign: 'center', gap: '8px'
                                }}>
                                    <MapPin style={{ width: '48px', height: '48px', color: '#94a3b8' }} />
                                    <p style={{ color: '#475569', fontWeight: '600' }}>Place de la Résistance</p>
                                    <p style={{ color: '#64748b', fontSize: '14px' }}>Laayoune 70000, Maroc</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Directions</h3>
                                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.7' }}>
                                    L'Agence Urbaine se situe au centre-ville de Laayoune, 
                                    à proximité de la Place de la Résistance. Accessible par 
                                    les principales artères de la ville.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                backgroundColor: '#0f172a', padding: '32px',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{
                    maxWidth: '1100px', margin: '0 auto',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '0.06em' }}>
                        © 2026 AGENCE URBAINE DE LAÂYOUNE SAKIA EL HAMRA
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none',
                            fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        <ArrowLeft style={{ width: '16px', height: '16px' }} />
                        Retour à l'accueil
                    </button>
                </div>
            </footer>
        </div>
    );
}
