import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(stored);
    }, []);

    const updateCart = (updated) => {
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
    };

    const handleIncrease = (id) => {
        const updated = cart.map((item) =>
            item._id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCart(updated);
    };

    const handleDecrease = (id) => {
        const updated = cart.map((item) =>
            item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
        );
        updateCart(updated);
    };

    const handleRemove = (id) => {
        const updated = cart.filter((item) => item._id !== id);
        updateCart(updated);
    };

    const handleClearCart = () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            updateCart([]);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.amount || 0) * item.quantity, 0);

    return (
        <>
            <Header />
            <div style={{ backgroundColor: '#F2EEE2', minHeight: '80vh', padding: '40px 0' }}>
                <div className="container">

                    {/* Page Title */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold" style={{ color: '#3B2107' }}>
                            My Cart{' '}
                            {cart.length > 0 && (
                                <span style={{ fontSize: '16px', color: '#8B7355' }}>
                                    ({cart.length} item{cart.length > 1 ? 's' : ''})
                                </span>
                            )}
                        </h3>
                        {cart.length > 0 && (
                            <button onClick={handleClearCart} style={{
                                background: 'none', border: '1.5px solid #991B1B',
                                color: '#991B1B', borderRadius: '50px', padding: '6px 18px',
                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            }}>
                                <i className="bi bi-trash me-1"></i> Clear Cart
                            </button>
                        )}
                    </div>

                    {/* Empty Cart */}
                    {cart.length === 0 && (
                        <div className="text-center py-5">
                            <i className="bi bi-cart-x" style={{ fontSize: '64px', color: '#c5b89a' }}></i>
                            <h5 className="mt-3 fw-semibold" style={{ color: '#6E491C' }}>Your cart is empty</h5>
                            <p style={{ color: '#8B7355' }}>Browse our services and add something!</p>
                            <button
                                onClick={() => navigate('/all-services')}
                                style={{
                                    backgroundColor: '#6E491C', color: 'white',
                                    border: 'none', borderRadius: '50px',
                                    padding: '12px 30px', fontWeight: '700',
                                    fontSize: '15px', cursor: 'pointer', marginTop: '10px',
                                }}
                            >
                                Browse Services
                            </button>
                        </div>
                    )}

                    {/* Cart Items + Summary */}
                    {cart.length > 0 && (
                        <div className="row g-4">

                            {/* Cart Items */}
                            <div className="col-lg-8">
                                {cart.map((item) => (
                                    <div key={item._id} className="bg-white rounded-3 shadow-sm p-4 mb-3"
                                        style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                                        {/* Image */}
                                        {item.image ? (
                                            <img
                                                src={`http://localhost:5000/uploads/${item.image}`}
                                                alt={item.name}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '12px',
                                                backgroundColor: '#F2EEE2', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <i className="bi bi-heart-pulse" style={{ fontSize: '28px', color: '#A8C060' }}></i>
                                            </div>
                                        )}

                                        {/* Details */}
                                        <div style={{ flexGrow: 1 }}>
                                            <h6 className="fw-bold mb-1" style={{ color: '#3B2107' }}>{item.name}</h6>
                                            <p style={{ color: '#8AAD3F', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                                                {item.amount ? `${item.amount} AED` : 'Price on request'}
                                            </p>
                                        </div>

                                        {/* Quantity */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            backgroundColor: '#F2EEE2', borderRadius: '50px', padding: '6px 14px',
                                        }}>
                                            <button onClick={() => handleDecrease(item._id)} style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#6E491C', fontWeight: '700', fontSize: '20px',
                                                padding: 0, lineHeight: 1,
                                            }}>−</button>
                                            <span style={{ fontWeight: '600', minWidth: '20px', textAlign: 'center', color: '#3B2107' }}>
                                                {item.quantity}
                                            </span>
                                            <button onClick={() => handleIncrease(item._id)} style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#6E491C', fontWeight: '700', fontSize: '20px',
                                                padding: 0, lineHeight: 1,
                                            }}>+</button>
                                        </div>

                                        {/* Item Total */}
                                        <div style={{ minWidth: '90px', textAlign: 'right' }}>
                                            <p style={{ color: '#3B2107', fontWeight: '700', fontSize: '16px', margin: 0 }}>
                                                {item.amount ? `${item.amount * item.quantity} AED` : '-'}
                                            </p>
                                        </div>

                                        {/* Remove */}
                                        <button onClick={() => handleRemove(item._id)} style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#991B1B', fontSize: '20px', padding: '4px',
                                            display: 'flex', alignItems: 'center',
                                        }}>
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    </div>
                                ))}

                                {/* Continue Shopping */}
                                <button onClick={() => navigate('/all-services')} style={{
                                    background: 'none', border: '1.5px solid #6E491C',
                                    color: '#6E491C', borderRadius: '50px', padding: '10px 24px',
                                    fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                }}>
                                    <i className="bi bi-arrow-left"></i> Continue Shopping
                                </button>
                            </div>

                            {/* Order Summary */}
                            <div className="col-lg-4">
                                <div className="bg-white rounded-3 shadow-sm p-4">
                                    <h5 className="fw-bold mb-4" style={{ color: '#3B2107' }}>Order Summary</h5>

                                    {cart.map((item) => (
                                        <div key={item._id} className="d-flex justify-content-between mb-2">
                                            <span style={{ color: '#6b6375', fontSize: '14px' }}>
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span style={{ color: '#3B2107', fontWeight: '600', fontSize: '14px' }}>
                                                {item.amount ? `${item.amount * item.quantity} AED` : '-'}
                                            </span>
                                        </div>
                                    ))}

                                    <hr style={{ borderColor: '#e5e0d8', margin: '16px 0' }} />

                                    <div className="d-flex justify-content-between mb-4">
                                        <span style={{ color: '#3B2107', fontWeight: '700', fontSize: '16px' }}>Total</span>
                                        <span style={{ color: '#8AAD3F', fontWeight: '700', fontSize: '20px' }}>
                                            {total} AED
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const customerId = localStorage.getItem('customerId');
                                            if (!customerId) {
                                                navigate('/login');
                                            } else {
                                                navigate('/checkout');
                                            }
                                        }}
                                        style={{
                                            width: '100%', backgroundColor: '#6E491C',
                                            color: 'white', border: 'none', borderRadius: '50px',
                                            padding: '14px', fontWeight: '700', fontSize: '16px',
                                            cursor: 'pointer', transition: 'background-color 0.2s',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', gap: '8px',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5a3a14'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6E491C'}
                                    >
                                        <i className="bi bi-bag-check"></i> Proceed to Checkout
                                    </button>

                                    <p className="text-center mt-3 mb-0" style={{ fontSize: '12px', color: '#8B7355' }}>
                                        <i className="bi bi-shield-check me-1"></i>
                                        Secure checkout — your data is safe
                                    </p>
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

export default Cart;
