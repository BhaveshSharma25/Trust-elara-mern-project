import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';

const API_SERVICES = 'http://localhost:5000/api/services';
const API_CATEGORIES = 'http://localhost:5000/api/categories';

const CategoryServices = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
        try {
        setLoading(true);
        const [svcRes, catRes] = await Promise.all([
          axios.get(API_SERVICES),
          axios.get(`${API_CATEGORIES}/${id}`),
        ]);
        if (svcRes.data.success) {
          // keep inactive services visible so we can mark them unavailable
          const filtered = svcRes.data.services.filter(s => (s.categoryId && s.categoryId._id ? s.categoryId._id === id : s.categoryId === id));
          setServices(filtered);
        }
        if (catRes.data.success) setCategory(catRes.data.category);
      } catch (err) {
        setError('Failed to load services for this category.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', padding: '40px 0' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#6E491C', cursor: 'pointer', padding: 0 }}>
                ← Back to Home
              </button>
              <h3 className="fw-bold mt-2" style={{ color: '#3B2107' }}>{category?.name || 'Category'}</h3>
              <p style={{ color: '#8B7355' }}>{category?.shortDescription || ''}</p>
            </div>
            <div>
              <button onClick={() => navigate('/all-services')} style={{ backgroundColor: '#6E491C', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 18px' }}>Browse All</button>
            </div>
          </div>

          {loading && <div className="bg-white rounded-3 shadow-sm p-5 text-center"><div className="spinner-border" style={{ color: '#6E491C' }}></div></div>}
          {!loading && error && <div className="bg-white rounded-3 shadow-sm p-5 text-center text-danger">{error}</div>}

          {!loading && !error && services.length === 0 && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">No services in this category.</div>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="row g-4">
              {services.map(s => (
                    <div key={s._id} className="col-sm-6 col-lg-3">
                      <div className="bg-white rounded-3 p-3" style={{ cursor: s.active ? 'pointer' : 'not-allowed', opacity: s.active ? 1 : 0.6 }} onClick={() => { if (s.active) navigate(`/services/${s._id}`); }}>
                    <div style={{ height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {s.image ? <img src={`http://localhost:5000/uploads/${s.image}`} alt={s.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%' }} /> : <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#F2EEE2' }} />}
                    </div>
                    <h6 className="fw-bold mt-3 text-center">{s.name}</h6>
                        {!s.active && (
                          <div className="text-center mb-2"><span className="badge rounded-pill" style={{ backgroundColor: '#F3F4F6', color: '#6B5840' }}>Unavailable</span></div>
                        )}
                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-3" style={{ minHeight: '36px' }}>
                      {s.gender && (
                        <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="bi bi-person-fill"></i>{s.gender}
                        </span>
                      )}
                      {s.ageGroup && (
                        <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="bi bi-people-fill"></i>{s.ageGroup.replace(/_/g, ' ')}</span>
                      )}
                      {s.fasting && (
                        <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="bi bi-droplet-fill"></i>{`Fasting: ${s.fasting}`}
                        </span>
                      )}
                      {s.vitalSystem && (
                        <span style={{ backgroundColor: '#F2EEE2', color: '#6E491C', padding: '6px 12px', borderRadius: '24px', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <i className="bi bi-heart-pulse"></i>{s.vitalSystem.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                    <p className="text-center text-muted">{s.shortDescription}</p>
                    <div className="text-center fw-bold" style={{ color: '#8AAD3F' }}>{s.amount ? `${s.amount} AED` : 'Price on request'}</div>
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

export default CategoryServices;
