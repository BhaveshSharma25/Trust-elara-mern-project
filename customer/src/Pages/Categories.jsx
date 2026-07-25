import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import '../App.css';

const API_CATEGORIES = 'http://localhost:5000/api/categories';

const Categories = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_CATEGORIES);
        if (res.data.success) {
          // show only active categories
          setCats(res.data.categories.filter(c => c.active));
        }
      } catch (err) {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', padding: '40px 0' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mt-2" style={{ color: '#3B2107' }}>Categories</h3>
              <p style={{ color: '#8B7355' }}>Browse all available categories and choose the care option that fits your needs.</p>
            </div>
            <div>
              <button onClick={() => navigate('/all-services')} style={{ backgroundColor: '#6E491C', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 18px' }}>Browse All</button>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#6E491C' }}></div>
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-5 text-danger">{error}</div>
          )}

          {!loading && !error && cats.length === 0 && (
            <div className="text-center py-5">No categories available.</div>
          )}

          {!loading && !error && cats.length > 0 && (
            <div className="row g-4">
              {cats.map((cat) => (
                <div key={cat._id} className="col-sm-6 col-lg-4">
                  <div className="bg-white rounded-3 p-3" style={{ cursor: 'pointer' }} onClick={() => navigate(`/category/${cat._id}`)}>
                    <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {cat.image ? (
                        <img src={`http://localhost:5000/uploads/${cat.image}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#F2EEE2' }} />
                      )}
                    </div>
                    <div style={{ padding: '18px' }}>
                      <h5 className="fw-bold mb-1" style={{ color: '#3B2107' }}>{cat.name}</h5>
                      <p className="text-muted small">{cat.shortDescription || cat.description || ''}</p>
                      <div style={{ marginTop: '12px' }}>
                        <button className="btn" style={{ backgroundColor: '#6E491C', color: 'white', borderRadius: '30px', padding: '10px 18px' }} onClick={(e) => { e.stopPropagation(); navigate(`/category/${cat._id}`); }}>View Services</button>
                      </div>
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

export default Categories;
