import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        notes: '',
    });

    useEffect(() => {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
            navigate('/login');
            return;
        }
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        if (stored.length === 0) {
            navigate('/cart');
            return;
        }
        setCart(stored);

        // Pre-fill name from localStorage
        const name = localStorage.getItem('customerName') || '';
        setFormData((prev) => ({ ...prev, fullName: name }));
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const total = cart.reduce((sum, item) => sum + (item.amount || 0) * item.quantity, 0);

    const handlePlaceOrder = async () => {
        setError('');
        if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setSubmitting(true);
            const customerId = localStorage.getItem('customerId');

            // Place one order per cart item
            const orderPromises = cart.map((item) =>
                axios.post('http://localhost:5000/api/orders', {
                    customerId,
                    serviceId: item._id,
                    amount: (item.amount || 0) * item.quantity,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    notes: formData.notes,
                })
            );
            await Promise.all(orderPromises);

            // Clear cart
            localStorage.removeItem('cart');
            window.dispatchEvent(new Event('storage'));
            setSuccess(true);
        } catch (err) {
            setError('Failed to place order. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) return (
        <>
            <Header />
            <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 text-center">
                            <div className="bg-white rounded-4 shadow-sm p-5">
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    backgroundColor: '#D1FAE5', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                                }}>
                                    <i className="bi bi-check-lg" style={{ fontSize: '36px', color: '#065F46' }}></i>
                                </div>
                                <h4 className="fw-bold mb-2" style={{ color: '#3B2107' }}>Order Placed Successfully!</h4>
                                <p style={{ color: '#8B7355', fontSize: '15px' }}>
                                    Thank you for your order. Our team will contact you shortly to confirm your booking.
                                </p>
                                <div className="d-flex gap-3 justify-content-center mt-4">
                                    <button onClick={() => navigate('/')} style={{
                                        backgroundColor: '#6E491C', color: 'white', border: 'none',
                                        borderRadius: '50px', padding: '12px 28px', fontWeight: '700',
                                        fontSize: '15px', cursor: 'pointer',
                                    }}>
                                        Back to Home
                                    </button>
                                    <button onClick={() => navigate('/my-orders')} style={{
                                        backgroundColor: 'transparent', color: '#6E491C',
                                        border: '1.5px solid #6E491C',
                                        borderRadius: '50px', padding: '12px 28px', fontWeight: '700',
                                        fontSize: '15px', cursor: 'pointer',
                                    }}>
                                        View My Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', padding: '40px 0' }}>
                <div className="container">

                    {/* Page Title */}
                    <div className="mb-4">
                        <button onClick={() => navigate('/cart')} style={{
                            background: 'none', border: 'none', color: '#6E491C',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: 0,
                        }}>
                            <i className="bi bi-arrow-left"></i> Back to Cart
                        </button>
                        <h3 className="fw-bold mt-2" style={{ color: '#3B2107' }}>Checkout</h3>
                    </div>

                    <div className="row g-4">

                        {/* Left — Booking Details Form */}
                        <div className="col-lg-7">
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#3B2107' }}>
                                    <i className="bi bi-person-lines-fill me-2" style={{ color: '#8AAD3F' }}></i>
                                    Booking Details
                                </h5>

                                {error && (
                                    <div className="alert alert-danger py-2" style={{ fontSize: '14px', borderRadius: '10px' }}>
                                        {error}
                                    </div>
                                )}

                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            Full Name <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" name="fullName" className="form-control py-2"
                                            placeholder="Enter your full name"
                                            value={formData.fullName} onChange={handleChange}
                                            style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            Email <span className="text-danger">*</span>
                                        </label>
                                        <input type="email" name="email" className="form-control py-2"
                                            placeholder="Enter your email"
                                            value={formData.email} onChange={handleChange}
                                            style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            Phone Number <span className="text-danger">*</span>
                                        </label>
                                        <input type="tel" name="phone" className="form-control py-2"
                                            placeholder="Enter your phone number"
                                            value={formData.phone} onChange={handleChange}
                                            style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            Address <span className="text-danger">*</span>
                                        </label>
                                        <input type="text" name="address" className="form-control py-2"
                                            placeholder="Enter your home address"
                                            value={formData.address} onChange={handleChange}
                                            style={{ borderRadius: '8px' }} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            City <span className="text-danger">*</span>
                                        </label>
                                        <select name="city" className="form-select py-2"
                                            value={formData.city} onChange={handleChange}
                                            style={{ borderRadius: '8px' }}>
                                            <option value="">Select your city</option>
                                            <option value="dubai">Dubai</option>
                                            <option value="abu_dhabi">Abu Dhabi</option>
                                            <option value="sharjah">Sharjah</option>
                                            <option value="ajman">Ajman</option>
                                            <option value="ras_al_khaimah">Ras Al Khaimah</option>
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-medium" style={{ color: '#6E491C' }}>
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea name="notes" className="form-control" rows="3"
                                            placeholder="Any special instructions or notes for the service provider..."
                                            value={formData.notes} onChange={handleChange}
                                            style={{ borderRadius: '8px' }}></textarea>
                                    </div>
                                </div>

                                {/* Info box */}
                                <div className="mt-4 p-3 rounded-3" style={{ backgroundColor: '#F2EEE2' }}>
                                    <p className="mb-0" style={{ fontSize: '13px', color: '#6E491C' }}>
                                        <i className="bi bi-info-circle me-2"></i>
                                        Our team will contact you within 24 hours to confirm your appointment and provide further details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right — Order Summary */}
                        <div className="col-lg-5">
                            <div className="bg-white rounded-3 shadow-sm p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#3B2107' }}>
                                    <i className="bi bi-receipt me-2" style={{ color: '#8AAD3F' }}></i>
                                    Order Summary
                                </h5>

                                {/* Cart Items */}
                                {cart.map((item) => (
                                    <div key={item._id} className="d-flex align-items-center gap-3 mb-3 pb-3"
                                        style={{ borderBottom: '1px solid #f0ebe3' }}>
                                        {item.image ? (
                                            <img src={`http://localhost:5000/uploads/${item.image}`}
                                                alt={item.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                                        ) : (
                                            <div style={{
                                                width: '50px', height: '50px', borderRadius: '8px',
                                                backgroundColor: '#F2EEE2', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <i className="bi bi-heart-pulse" style={{ color: '#A8C060', fontSize: '20px' }}></i>
                                            </div>
                                        )}
                                        <div style={{ flexGrow: 1 }}>
                                            <p className="fw-semibold mb-0" style={{ fontSize: '14px', color: '#3B2107' }}>{item.name}</p>
                                            <p className="mb-0" style={{ fontSize: '13px', color: '#8B7355' }}>Qty: {item.quantity}</p>
                                        </div>
                                        <p className="fw-bold mb-0" style={{ fontSize: '14px', color: '#3B2107' }}>
                                            {item.amount ? `${item.amount * item.quantity} AED` : '-'}
                                        </p>
                                    </div>
                                ))}

                                {/* Totals */}
                                <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: '#8B7355', fontSize: '14px' }}>Subtotal</span>
                                    <span style={{ color: '#3B2107', fontWeight: '600', fontSize: '14px' }}>{total} AED</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span style={{ color: '#8B7355', fontSize: '14px' }}>Home Visit Fee</span>
                                    <span style={{ color: '#8AAD3F', fontWeight: '600', fontSize: '14px' }}>Free</span>
                                </div>

                                <hr style={{ borderColor: '#e5e0d8' }} />

                                <div className="d-flex justify-content-between mb-4">
                                    <span style={{ color: '#3B2107', fontWeight: '700', fontSize: '16px' }}>Total</span>
                                    <span style={{ color: '#8AAD3F', fontWeight: '700', fontSize: '22px' }}>{total} AED</span>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={submitting}
                                    style={{
                                        width: '100%', backgroundColor: '#6E491C',
                                        color: 'white', border: 'none', borderRadius: '50px',
                                        padding: '14px', fontWeight: '700', fontSize: '16px',
                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', gap: '8px',
                                        opacity: submitting ? 0.7 : 1,
                                    }}
                                >
                                    {submitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-bag-check-fill"></i>
                                            Place Order
                                        </>
                                    )}
                                </button>

                                <p className="text-center mt-3 mb-0" style={{ fontSize: '12px', color: '#8B7355' }}>
                                    <i className="bi bi-shield-check me-1"></i>
                                    Your information is secure and private
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
