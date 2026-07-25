import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../App.css';
import loginImage from '../images/login-hero.png'

const CustomerLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setSubmitting(true);
            const res = await axios.post('http://localhost:5000/api/customers/login', formData);
            if (res.data.success) {
                localStorage.setItem('customerId', res.data.customerId);
                localStorage.setItem('customerName', res.data.name);
                navigate('/');
                window.location.reload();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#F2EEE2', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <div className="container">
                <div className="row align-items-center justify-content-center g-0" style={{ minHeight: '90vh' }}>

                    {/* Left — Doctor Image */}
                    <div className="col-md-5 d-none d-md-block pe-4">
                        <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src= {loginImage}
                                alt="Doctor"
                                style={{
                                    width: '100%',
                                    height: '580px',
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                            {/* Green overlay */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundColor: 'rgba(74, 113, 60, 0.45)',
                                borderRadius: '24px',
                            }}></div>
                        </div>
                    </div>

                    {/* Right — Login Form */}
                    <div className="col-md-5 ps-md-4">

                        {/* Back to Home */}
                        <div className="mb-3">
                            <Link
                                to="/"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    color: '#6E491C',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                }}
                            >
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </Link>
                        </div>

                        {/* Logo */}
                        <div className="text-center mb-4">
                            <Link to="/" style={{ textDecoration: 'none' }}>
                                <img src="/Images/health-serve-logo.png" alt="Elara Logo" height="65px" />
                            </Link>
                        </div>

                        <h3 className="fw-bold text-center mb-4" style={{ color: '#3B2107', fontSize: '32px' }}>
                            Log In
                        </h3>

                        {error && (
                            <div className="alert alert-danger py-2 text-center mb-3"
                                style={{ fontSize: '14px', borderRadius: '12px' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control py-3 px-4"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        borderRadius: '50px',
                                        backgroundColor: '#EDE8DF',
                                        border: 'none',
                                        fontSize: '15px',
                                        color: '#3B2107',
                                    }}
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3 position-relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    className="form-control py-3 px-4"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        borderRadius: '50px',
                                        backgroundColor: '#EDE8DF',
                                        border: 'none',
                                        fontSize: '15px',
                                        color: '#3B2107',
                                        paddingRight: '50px',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '18px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        color: '#8B7355', cursor: 'pointer', padding: 0,
                                    }}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                                        style={{ fontSize: '18px' }}></i>
                                </button>
                            </div>

                            {/* Remember Me + Forgot Password */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        style={{ borderColor: '#6E491C' }}
                                    />
                                    <label className="form-check-label fw-semibold" htmlFor="rememberMe"
                                        style={{ color: '#3B2107', fontSize: '14px' }}>
                                        Remember Me
                                    </label>
                                </div>
                                <a href="#" style={{
                                    color: '#3B2107', fontSize: '14px',
                                    fontWeight: '600', textDecoration: 'none'
                                }}>
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-100 py-3 fw-bold"
                                disabled={submitting}
                                style={{
                                    backgroundColor: '#6E491C',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontSize: '16px',
                                    letterSpacing: '0.5px',
                                    transition: 'background-color 0.2s',
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#5a3a14'}
                                onMouseLeave={e => e.target.style.backgroundColor = '#6E491C'}
                            >
                                {submitting ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="text-center mt-4 mb-0" style={{ fontSize: '15px', color: '#6b6375' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ color: '#3B2107', fontWeight: '700', textDecoration: 'none' }}>
                                Register
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomerLogin;
