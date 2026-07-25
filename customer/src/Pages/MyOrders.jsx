import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const STATUS_STYLES = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF' },
  shipped: { bg: '#E6F4FF', text: '#1D4ED8' },
  out_for_delivery: { bg: '#FEF3C7', text: '#D97706' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  completed: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const customerId = localStorage.getItem('customerId');
    if (!customerId) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/orders/customer/${customerId}`);
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setError('No orders found yet.');
        }
      } catch (err) {
        setError('Unable to load your orders right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: 'cancelled',
      });
      if (res.data.success) {
        setOrders((prev) => prev.map((order) =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      }
    } catch (err) {
      setError('Unable to cancel your order right now.');
    }
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
              <h3 className="fw-bold mt-2 mb-1" style={{ color: '#3B2107' }}>My Orders</h3>
              <p className="mb-0" style={{ color: '#8B7355' }}>
                Track your bookings and service requests in one place.
              </p>
            </div>
            <button
              onClick={() => navigate('/all-services')}
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
              Browse Services
            </button>
          </div>

          {loading && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
              <div className="spinner-border mb-3" style={{ color: '#6E491C' }}></div>
              <p className="mb-0" style={{ color: '#6E491C' }}>Loading your orders...</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
              <i className="bi bi-exclamation-circle mb-3" style={{ fontSize: '28px', color: '#A05252' }}></i>
              <p className="mb-3" style={{ color: '#3B2107' }}>{error}</p>
              <button
                onClick={() => navigate('/all-services')}
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
                Explore Services
              </button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="bg-white rounded-3 shadow-sm p-5 text-center">
              <i className="bi bi-bag-check mb-3" style={{ fontSize: '28px', color: '#8AAD3F' }}></i>
              <h5 className="fw-bold" style={{ color: '#3B2107' }}>No orders yet</h5>
              <p className="mb-0" style={{ color: '#8B7355' }}>
                Your placed orders will appear here once you book a service.
              </p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="row g-3">
              {orders.map((order) => {
                const style = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                return (
                  <div className="col-12" key={order._id}>
                    <div className="bg-white rounded-3 shadow-sm p-4">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="fw-bold" style={{ color: '#3B2107' }}>
                              Order #{order._id?.slice(-6).toUpperCase()}
                            </span>
                            <span
                              className="px-2 py-1 rounded-pill small fw-semibold"
                              style={{ backgroundColor: style.bg, color: style.text }}
                            >
                              {order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status.charAt(0).toUpperCase() + order.status.slice(1).replace(/_/g, ' ')}
                            </span>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ color: '#3B2107' }}>
                            {order.serviceId?.name || 'Service'}
                          </h6>
                          <p className="mb-1" style={{ color: '#8B7355', fontSize: '14px' }}>
                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}
                          </p>
                          {order.notes && (
                            <p className="mb-0" style={{ color: '#6E491C', fontSize: '14px' }}>
                              Notes: {order.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-md-end">
                          <div className="fw-bold" style={{ color: '#3B2107', fontSize: '18px' }}>
                            {order.amount ? `${order.amount} AED` : '-'}
                          </div>
                          <p className="mb-0 mt-1" style={{ color: '#8B7355', fontSize: '13px' }}>
                            Status updates will appear here as the team confirms your booking.
                          </p>
                          {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'out_for_delivery' && (
                            <button
                              className="btn btn-sm btn-outline-danger mt-3"
                              onClick={() => handleCancel(order._id)}
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;
