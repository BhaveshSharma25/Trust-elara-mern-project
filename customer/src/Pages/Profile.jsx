import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const Profile = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [customerRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/customers/${customerId}`),
          axios.get(`http://localhost:5000/api/orders/customer/${customerId}`),
        ]);

        if (customerRes.data.success) {
          setCustomer(customerRes.data.customer);
        } else {
          setError('Unable to load your profile.');
        }

        if (ordersRes.data.success) {
          setOrders(ordersRes.data.orders);
        }
      } catch (err) {
        setError('Unable to load profile data at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatStatusText = (status) => {
    if (!status) return '';
    return status === 'out_for_delivery'
      ? 'Out for Delivery'
      : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  return (
    <>
      <Header />
      <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', padding: '40px 0' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6E491C',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>Back to Home
              </button>
              <h3 className="fw-bold mt-2 mb-1" style={{ color: '#3B2107' }}>My Profile</h3>
              <p className="mb-0" style={{ color: '#8B7355' }}>
                View your registered details and recent bookings in one place.
              </p>
            </div>
            <button
              onClick={() => navigate('/my-orders')}
              style={{
                backgroundColor: '#6E491C',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                padding: '10px 20px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              View My Orders
            </button>
          </div>

          {loading && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
              <div className="spinner-border mb-3" style={{ color: '#6E491C' }}></div>
              <p className="mb-0" style={{ color: '#6E491C' }}>Loading profile...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
              <i className="bi bi-exclamation-circle mb-3" style={{ fontSize: '28px', color: '#A05252' }}></i>
              <p className="mb-3" style={{ color: '#3B2107' }}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#6E491C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '10px 20px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && customer && (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="bg-white rounded-3 shadow-sm p-4">
                  <h5 className="fw-bold mb-3" style={{ color: '#3B2107' }}>Profile Information</h5>
                  <div className="mb-3">
                    <div className="text-muted small">Name</div>
                    <div className="fw-semibold" style={{ color: '#3B2107' }}>{customer.name}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted small">Email</div>
                    <div className="fw-semibold" style={{ color: '#3B2107' }}>{customer.email}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted small">Phone</div>
                    <div className="fw-semibold" style={{ color: '#3B2107' }}>{customer.phone || '-'}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-muted small">Member Since</div>
                    <div className="fw-semibold" style={{ color: '#3B2107' }}>
                      {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : '-'}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => navigate('/my-orders')}
                    >
                      See all orders
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="bg-white rounded-3 shadow-sm p-4">
                  <h5 className="fw-bold mb-3" style={{ color: '#3B2107' }}>Recent Orders</h5>

                  {orders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      <i className="bi bi-bag-check" style={{ fontSize: '32px', color: '#8AAD3F' }}></i>
                      <p className="mt-3 mb-0">No orders found yet.</p>
                    </div>
                  ) : (
                    <div className="list-group">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order._id} className="list-group-item list-group-item-action rounded-3 mb-3">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <div className="fw-semibold text-dark">Order #{order._id?.slice(-6).toUpperCase()}</div>
                              <div className="small text-muted">{order.serviceId?.name || 'Service'}</div>
                              <div className="small mt-1">
                                <span className="me-3">₹{order.amount?.toLocaleString('en-IN')}</span>
                                <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}</span>
                              </div>
                            </div>
                            <span className="badge rounded-pill"
                              style={{
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                                fontSize: '12px',
                                textTransform: 'none',
                              }}>
                              {formatStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
