import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const API_BASE = 'http://localhost:5000/api/services';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSessions, setSelectedSessions] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/${id}`);
                if (res.data.success) setService(res.data.service);
            } catch (err) {
                setError('Failed to load service details.');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleAddToCart = () => {
        if (!service || !service.active) {
            setError('This service is currently unavailable.');
            return;
        }
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((item) => item._id === service._id && item.sessions === selectedSessions);
        const amount = service.amount || 0;
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                _id: service._id,
                name: service.name,
                image: service.image,
                quantity: 1,
                amount: amount * selectedSessions,
                sessions: selectedSessions,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    if (loading) return (
        <>
            <Header />
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-border" style={{ color: '#6E491C' }}></div>
            </div>
            <Footer />
        </>
    );

    if (error || !service) return (
        <>
            <Header />
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#991B1B' }}>{error || 'Service not found.'}</p>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#fff', minHeight: '80vh' }}>
                <div className="container py-5">

                    {/* Back link */}
                    <div className="mb-4">
                        <button onClick={() => navigate(-1)} style={{
                            background: 'none', border: 'none', color: '#6E491C',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px', padding: 0,
                        }}>
                            <i className="bi bi-arrow-left"></i> Back to Services
                        </button>
                    </div>

                    <div className="row g-5">

                        {/* Left — Image + Short Description */}
                        <div className="col-md-6">
                            <div style={{
                                borderRadius: '16px', overflow: 'hidden',
                                position: 'relative', backgroundColor: '#F2EEE2',
                            }}>
                                {/* Category / Title overlay */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0,
                                    padding: '24px 28px',
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)',
                                    borderRadius: '16px 16px 0 0',
                                }}>
                                    <h2 style={{
                                        color: '#fff', fontWeight: '800',
                                        fontSize: '28px', textTransform: 'uppercase',
                                        letterSpacing: '1px', margin: 0,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                    }}>
                                        {service.categoryId?.name || service.name}
                                    </h2>
                                    {service.shortDescription && (
                                        <p style={{
                                            color: '#fff', fontSize: '16px',
                                            marginTop: '8px', fontWeight: '400',
                                            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                        }}>
                                            {service.shortDescription}
                                        </p>
                                    )}
                                </div>

                                {/* Service Image */}
                                {service.image ? (
                                    <img
                                        src={`http://localhost:5000/uploads/${service.image}`}
                                        alt={service.name}
                                        style={{
                                            width: '100%', height: '460px',
                                            objectFit: 'cover', display: 'block',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '460px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: '#F2EEE2',
                                    }}>
                                        <i className="bi bi-heart-pulse" style={{ fontSize: '80px', color: '#A8C060' }}></i>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right — Details */}
                        <div className="col-md-6">
                            <h3 style={{ color: '#1a1a1a', fontWeight: '700', fontSize: '26px', marginBottom: '8px' }}>
                                {service.name}
                            </h3>


                            {/* Long Description bullets */}
                            {service.longDescription && (
                                <div className="mb-4">
                                    {service.longDescription.split('\n').filter(l => l.trim()).map((line, i) => (
                                        <div key={i} className="d-flex align-items-start gap-2 mb-2">
                                            <span style={{ fontSize: '18px' }}>
                                                {i === 0 ? '🔬' : i === 1 ? '💙' : '🏠'}
                                            </span>
                                            <p style={{ color: '#333', fontSize: '15px', margin: 0 }}>{line}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Results / Provider info */}
                            {service.duration > 0 && (
                                <p style={{ color: '#555', fontSize: '14px', marginBottom: '6px' }}>
                                    <strong>Duration:</strong> {service.duration} minutes
                                </p>
                            )}
                            <p style={{ color: '#555', fontSize: '14px', marginBottom: '20px' }}>
                                <strong>Licensed Provider:</strong> Elara Health Services
                            </p>

                            {/* Price Box */}
                            <div style={{
                                backgroundColor: '#8AAD3F', borderRadius: '12px',
                                padding: '16px 20px', marginBottom: '16px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div className="d-flex align-items-center gap-3">
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%',
                                        border: '2px solid white', backgroundColor: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8AAD3F' }}></div>
                                    </div>
                                    <span style={{ color: '#fff', fontWeight: '600', fontSize: '16px' }}>Standard Price per Session</span>
                                </div>
                                <div className="text-end">
                                    <div style={{ color: '#fff', fontWeight: '700', fontSize: '20px' }}>
                                                {service.amount ? `${service.amount} AED` : 'Contact us'}
                                            </div>
                                            {!service.active && (
                                                <div style={{ marginTop: '8px' }}>
                                                    <span className="badge rounded-pill" style={{ backgroundColor: '#FDE68A', color: '#92400E' }}>Unavailable</span>
                                                </div>
                                            )}
                                </div>
                            </div>

                            {/* Session option selector */}
                            {service.amount ? (
                                <div className="mb-4">
                                    <div className="row gx-3 gy-3">
                                        {[1, 2, 4, 6].map((sessions) => {
                                            const selected = selectedSessions === sessions;
                                            return (
                                                <div className="col-12" key={sessions}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { if (service.active) setSelectedSessions(sessions); }}
                                                        style={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '18px 20px',
                                                            borderRadius: '16px',
                                                            border: selected ? '2px solid #6E491C' : '1px solid #D9E5C7',
                                                            backgroundColor: selected ? '#F5FBF1' : '#FBFBF9',
                                                            cursor: 'pointer',
                                                            color: '#3B2107',
                                                            boxShadow: selected ? '0 8px 18px rgba(110,73,28,0.08)' : 'none',
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center gap-3">
                                                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', border: selected ? '6px solid #6E491C' : '2px solid #A8C060', display: 'inline-block' }}></span>
                                                            <div>
                                                                <div style={{ fontWeight: '700', fontSize: '16px' }}>{sessions} Session{sessions > 1 ? 's' : ''}</div>
                                                                <div style={{ color: '#6E491C', fontSize: '12px', marginTop: '3px' }}>
                                                                    {sessions === 1 ? 'Standard price' : `${sessions} sessions package`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div style={{ textAlign: 'right' }}>
                                                            <div style={{ fontWeight: '700', fontSize: '18px', color: '#4A6B1E' }}>
                                                                {service.amount * sessions} AED
                                                            </div>
                                                            <div style={{ color: '#7A8C62', fontSize: '12px', marginTop: '2px' }}>
                                                                {sessions > 1 ? `Save ${sessions * 5}%` : 'Per session'}
                                                            </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div style={{ padding: '16px 18px', borderRadius: '14px', backgroundColor: '#F2F7E8' }}>
                                        <span style={{ color: '#4A6B1E', fontWeight: '600' }}>Pricing available on request.</span>
                                    </div>
                                </div>
                            )}

                            <div className="d-flex align-items-center gap-3 mb-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!service.active}
                                    style={{
                                        flex: 1, backgroundColor: service && service.active ? '#8AAD3F' : '#BEC5C0', color: service && service.active ? '#fff' : '#6B6B6B',
                                        border: 'none', borderRadius: '50px', padding: '14px 24px',
                                        fontWeight: '700', fontSize: '16px', cursor: service && service.active ? 'pointer' : 'not-allowed',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={e => { if (service && service.active) e.target.style.backgroundColor = '#739130' }}
                                    onMouseLeave={e => { if (service && service.active) e.target.style.backgroundColor = '#8AAD3F' }}
                                >
                                    {added ? '✓ Added to Cart!' : `Add ${selectedSessions} Session${selectedSessions > 1 ? 's' : ''}`}
                                </button>
                            </div>

                            {/* Talk to Expert button */}
                            <button
                                style={{
                                    width: '100%', backgroundColor: service && service.active ? '#6E491C' : '#BEC5C0', color: service && service.active ? '#fff' : '#6B6B6B',
                                    border: 'none', borderRadius: '50px', padding: '14px',
                                    fontWeight: '700', fontSize: '16px', cursor: service && service.active ? 'pointer' : 'not-allowed',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={e => { if (service && service.active) e.target.style.backgroundColor = '#5a3a14' }}
                                onMouseLeave={e => { if (service && service.active) e.target.style.backgroundColor = '#6E491C' }}
                                onClick={() => { if (!service || !service.active) setError('This service is currently unavailable.'); }}
                            >
                                Talk To An Expert
                            </button>

                            {/* Success message */}
                            {added && (
                                <div className="mt-3 text-center" style={{
                                    backgroundColor: '#D1FAE5', color: '#065F46',
                                    padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                                }}>
                                    ✓ Service added to cart successfully!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Long Description full section */}
                    {service.longDescription && (
                        <div className="mt-5 pt-4" style={{ borderTop: '1px solid #eee' }}>
                            <h5 style={{ color: '#3B2107', fontWeight: '700', marginBottom: '16px' }}>About this Service</h5>
                            <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.8' }}>
                                {service.longDescription}
                            </p>
                        </div>
                    )}

                </div>
            </div>
            <Footer />
        </>
    );
};

export default ServiceDetail;
