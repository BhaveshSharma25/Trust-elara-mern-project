import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';

const API_BASE = 'http://localhost:5000/api/services';

const ServiceListing = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
                try {
                setLoading(true);
                const res = await axios.get(API_BASE);
                if (res.data.success) {
                    // keep all services so inactive ones can show as Unavailable
                    setServices(res.data.services);
                }
            } catch (err) {
                setError('Failed to load services.');
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filtered = services.filter((s) =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.shortDescription?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Header />

            <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', paddingBottom: '60px' }}>

                {/* Page Header */}
                <div style={{ backgroundColor: '#F2EEE2', padding: '40px 0 20px' }}>
                    <div className="container">
                        <h2 className="fw-bold mb-1" style={{ color: '#3B2107', fontSize: '28px' }}>
                            Our Services
                        </h2>
                        <p style={{ color: '#8B7355', fontSize: '15px' }}>
                            Book from our wide range of health services — delivered right to your doorstep.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-3" style={{ maxWidth: '480px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                backgroundColor: '#EDE8DF', borderRadius: '50px',
                                padding: '10px 20px', gap: '10px',
                            }}>
                                <i className="bi bi-search" style={{ color: '#8B7355', fontSize: '16px' }}></i>
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        border: 'none', background: 'transparent',
                                        outline: 'none', fontSize: '14px',
                                        color: '#3B2107', width: '100%',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mt-4">

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: '#6E491C' }}></div>
                            <p className="mt-3" style={{ color: '#8B7355' }}>Loading services...</p>
                        </div>
                    )}

                    {/* Error */}
                    {!loading && error && (
                        <div className="text-center py-5">
                            <p style={{ color: '#991B1B' }}>{error}</p>
                        </div>
                    )}

                    {/* Empty */}
                    {!loading && !error && filtered.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox" style={{ fontSize: '48px', color: '#c5b89a' }}></i>
                            <p className="mt-3" style={{ color: '#8B7355' }}>No services found.</p>
                        </div>
                    )}

                    {/* Service Cards Grid */}
                    {!loading && !error && filtered.length > 0 && (
                        <div className="row g-4">
                                    {filtered.map((service) => (
                                <div className="col-sm-6 col-lg-3" key={service._id}>
                                    <div
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderRadius: '18px',
                                            border: '2px solid #A8C060',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            transition: 'transform 0.18s, box-shadow 0.18s',
                                            cursor: service.active ? 'pointer' : 'not-allowed',
                                            opacity: service.active ? 1 : 0.65,
                                            padding: '18px'
                                        }}
                                        onMouseEnter={e => {
                                            if (!service.active) return;
                                            e.currentTarget.style.transform = 'translateY(-6px)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.10)';
                                        }}
                                        onMouseLeave={e => {
                                            if (!service.active) return;
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Service Image with overlay action */}
                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                                            <div style={{ position: 'relative' }}>
                                                {service.image ? (
                                                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px #fff inset' }}>
                                                        <img
                                                            src={`http://localhost:5000/uploads/${service.image}`}
                                                            alt={service.name}
                                                            style={{
                                                                width: '140px', height: '140px',
                                                                objectFit: 'cover', borderRadius: '50%',
                                                                border: '6px solid #fff'
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ width: '160px', height: '160px', borderRadius: '50%', backgroundColor: '#F2EEE2', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #EDE8DF' }}>
                                                        <i className="bi bi-heart-pulse" style={{ fontSize: '48px', color: '#A8C060' }}></i>
                                                    </div>
                                                )}

                                                {/* Circular overlay button (top-right) */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); if (!service.active) return; navigate(`/services/${service._id}`); }}
                                                    title={service.active ? 'Quick view' : 'Service unavailable'}
                                                    aria-label={`View ${service.name}`}
                                                    style={{
                                                        position: 'absolute', top: '-6px', right: '-6px',
                                                        width: '44px', height: '44px', borderRadius: '50%',
                                                        backgroundColor: service.active ? '#6E491C' : '#9CA3AF', color: '#fff', border: '4px solid #fff',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: '0 6px 16px rgba(0,0,0,0.12)', cursor: service.active ? 'pointer' : 'not-allowed'
                                                    }}
                                                    onMouseEnter={e => { if (service.active) e.currentTarget.style.backgroundColor = '#5a3a14' }}
                                                    onMouseLeave={e => { if (service.active) e.currentTarget.style.backgroundColor = '#6E491C' }}
                                                >
                                                    <i className="bi bi-eye" style={{ fontSize: '18px' }}></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                            <h5 className="fw-bold mb-2" style={{ color: '#3B2107' }}>{service.name}</h5>
                                            {service.shortDescription && (
                                                <p style={{ color: '#8B7355', fontSize: '14px', lineHeight: 1.6 }}>{service.shortDescription}</p>
                                            )}

                                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '14px' }}>
                                                {service.gender && (
                                                    <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '20px', fontWeight: '600', fontSize: '13px', textTransform: 'capitalize' }}>{service.gender}</span>
                                                )}
                                                <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '13px' }}>{service.amount ? `${service.amount} AED` : 'Price on request'}</span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (!service.active) return;
                                                    navigate(`/services/${service._id}`);
                                                }}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: service.active ? '#6E491C' : '#BEC5C0',
                                                    color: service.active ? 'white' : '#6B6B6B',
                                                    border: 'none',
                                                    borderRadius: '30px',
                                                    padding: '12px',
                                                    fontWeight: '700',
                                                    fontSize: '16px',
                                                    cursor: service.active ? 'pointer' : 'not-allowed'
                                                }}
                                                onMouseEnter={e => { if (service.active) e.target.style.backgroundColor = '#5a3a14' }}
                                                onMouseLeave={e => { if (service.active) e.target.style.backgroundColor = '#6E491C' }}
                                            >
                                                {service.active ? 'Book Now' : 'Unavailable'}
                                            </button>
                                        </div>
                                </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ServiceListing;
