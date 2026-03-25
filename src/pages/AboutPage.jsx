import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Building2, 
    MapPin, 
    Phone, 
    Globe, 
    Users, 
    Target, 
    Award,
    ArrowLeft,
    Clock,
    FileText,
    Landmark,
    ChevronRight
} from 'lucide-react';
import logoDark from '/dark_mode_urbaine_logo.png';
import buildingImage from '../assets/building-perspective.jpg';

export default function AboutPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const tabs = [
        {
            id: 'presentation',
            title: 'Présentation',
            icon: Building2,
            content: `L'Agence Urbaine de Laâyoune Sakia El Hamra est un établissement public à caractère administratif, 
            doté de la personnalité morale et de l'autonomie financière. Placée sous la tutelle du Ministère 
            de l'Aménagement du Territoire National, de l'Urbanisme, de l'Habitat et de la Politique de la Ville.`
        },
        {
            id: 'historique',
            title: 'Historique',
            icon: Clock,
            content: `Créée par le Décret n° 2.15.361 du 27 Ramadan 1437 (02 Juillet 1997), l'Agence Urbaine de 
            Laâyoune Sakia El Hamra a été établie en application des dispositions du Dahir portant loi 
            n° 1.93.10 du 21 Rabii II 1414 (10.09.1993).`
        },
        {
            id: 'missions',
            title: 'Missions',
            icon: Target,
            content: `L'Agence Urbaine assure la promotion et la réalisation des opérations d'aménagement et 
            de construction, la gestion des équipements collectifs, et l'accompagnement des investisseurs 
            dans la région de Laâyoune Sakia El Hamra.`
        }
    ];

    const stats = [
        { number: '1997', label: 'Année de création' },
        { number: '50+', label: 'Projets réalisés' },
        { number: '100+', label: 'Employés' },
        { number: '1', label: 'Région couverte' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Poppins, Inter, sans-serif' }}>

            {/* Hero Section */}
            <div style={{ position: 'relative', height: '50vh', backgroundColor: '#0f172a', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.4,
                    backgroundImage: `url('${buildingImage}')`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.95))'
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
                        <button style={{ color: '#fff', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer' }}>
                            À PROPOS
                        </button>
                        <button onClick={() => navigate('/contact')} style={{ color: 'rgba(255,255,255,0.7)', border: 'none', background: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.08em', cursor: 'pointer' }}>
                            CONTACT
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '70%', padding: '0 16px'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem', fontWeight: '300', color: '#fff',
                        textAlign: 'center', letterSpacing: '-0.02em',
                        animation: 'slideUp 0.8s ease-out forwards', opacity: 0
                    }}>
                        À <span style={{ fontWeight: '700' }}>Propos</span>
                    </h1>
                    <div style={{ width: '80px', height: '2px', backgroundColor: 'rgba(255,255,255,0.3)', marginTop: '24px', animation: 'fadeIn 1s ease-out 0.3s forwards', opacity: 0 }}></div>
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ padding: '64px 32px', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1px', backgroundColor: '#e2e8f0',
                        borderRadius: '4px', overflow: 'hidden'
                    }}>
                        {stats.map((stat, idx) => (
                            <div key={stat.label} style={{
                                backgroundColor: '#fff', padding: '32px 16px',
                                textAlign: 'center',
                                animation: `slideUp 0.6s ease-out ${0.4 + idx * 0.15}s forwards`, opacity: 0
                            }}>
                                <p style={{ fontSize: '2.5rem', fontWeight: '300', color: '#0f172a', marginBottom: '8px' }}>
                                    {stat.number}
                                </p>
                                <p style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: '64px 32px', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '64px', alignItems: 'start'
                    }}>
                        {/* Left - Image */}
                        <div style={{ position: 'relative', animation: 'slideUp 0.8s ease-out 0.8s forwards', opacity: 0 }}>
                            <img
                                src={buildingImage}
                                alt="AULSH Building"
                                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '4px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
                            />
                            <div style={{
                                position: 'absolute', bottom: '-24px', right: '-24px',
                                backgroundColor: '#0f172a', color: '#fff',
                                padding: '24px', borderRadius: '4px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                animation: 'fadeIn 0.8s ease-out 1.2s forwards', opacity: 0
                            }}>
                                <Award style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
                                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Excellence</p>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Service de qualité</p>
                            </div>
                        </div>

                        {/* Right - Tabs */}
                        <div style={{ paddingTop: '16px', animation: 'slideUp 0.8s ease-out 1s forwards', opacity: 0 }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '300', color: '#0f172a', marginBottom: '32px' }}>
                                Qui Sommes-<span style={{ fontWeight: '700' }}>Nous</span>?
                            </h2>

                            {/* Tab Buttons */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                                {tabs.map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(index)}
                                        style={{
                                            padding: '10px 20px', fontSize: '13px', fontWeight: '600',
                                            letterSpacing: '0.02em', border: 'none', cursor: 'pointer',
                                            borderRadius: '4px', transition: 'all 0.2s',
                                            backgroundColor: activeTab === index ? '#0f172a' : '#f1f5f9',
                                            color: activeTab === index ? '#fff' : '#64748b'
                                        }}
                                    >
                                        {tab.title}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {tabs.map((tab, index) => (
                                <div key={tab.id} style={{ display: activeTab === index ? 'block' : 'none' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', backgroundColor: '#0f172a',
                                            borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <tab.icon style={{ width: '24px', height: '24px', color: '#fff' }} />
                                        </div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>
                                            {tab.title}
                                        </h3>
                                    </div>
                                    <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '15px' }}>
                                        {tab.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div style={{ padding: '64px 32px', backgroundColor: '#f8fafc' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px', animation: 'slideUp 0.8s ease-out 1.2s forwards', opacity: 0 }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: '300', color: '#0f172a', marginBottom: '16px' }}>
                            Nos <span style={{ fontWeight: '700' }}>Services</span>
                        </h2>
                        <div style={{ width: '64px', height: '2px', backgroundColor: '#cbd5e1', margin: '0 auto' }}></div>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1px', backgroundColor: '#e2e8f0',
                        borderRadius: '4px', overflow: 'hidden'
                    }}>
                        {[
                            { icon: MapPin, title: 'Urbanisme', desc: "Planification et gestion de l'espace urbain" },
                            { icon: Building2, title: 'Construction', desc: 'Promotion immobilière et suivi des chantiers' },
                            { icon: Landmark, title: 'Administration', desc: 'Gestion administrative et financière' }
                        ].map((service, idx) => (
                            <div key={service.title} style={{
                                backgroundColor: '#fff', padding: '40px 32px',
                                animation: `slideUp 0.6s ease-out ${1.3 + idx * 0.15}s forwards`, opacity: 0
                            }}>
                                <service.icon style={{ width: '36px', height: '36px', color: '#0f172a', marginBottom: '16px' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                                    {service.title}
                                </h3>
                                <p style={{ fontSize: '14px', color: '#64748b' }}>
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Block */}
            <div style={{ padding: '64px 32px', backgroundColor: '#fff', animation: 'slideUp 0.8s ease-out 1.5s forwards', opacity: 0 }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                            <div style={{ padding: '48px' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '300', color: '#fff', marginBottom: '32px' }}>
                                    Contactez-<span style={{ fontWeight: '700' }}>Nous</span>
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {[
                                        { icon: MapPin, label: 'Adresse', value: 'Place de la Résistance, BP 800, Laayoune 70000' },
                                        { icon: Phone, label: 'Téléphone', value: '05 28 89 18 12' },
                                        { icon: Globe, label: 'Site Web', value: 'www.aulaayoune.ma' }
                                    ].map((item) => (
                                        <div key={item.label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: '40px', height: '40px', minWidth: '40px',
                                                backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <item.icon style={{ width: '18px', height: '18px', color: '#fff' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</p>
                                                <p style={{ color: '#fff', fontSize: '14px' }}>{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px' }}>
                                <img src={logoDark} alt="AULSH Logo" style={{ maxHeight: '128px' }} />
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
                    maxWidth: '1000px', margin: '0 auto',
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
                            fontSize: '14px', cursor: 'pointer'
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
