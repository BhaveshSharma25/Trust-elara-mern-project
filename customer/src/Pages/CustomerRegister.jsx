import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import registerHero from '../images/register-hero.png';
import '../App.css';

const CustomerRegister = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        phone: '', referralCode: '',
        password: '', confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validatePassword = (pwd) => {
        return pwd.length >= 8 &&
            /[A-Z]/.test(pwd) &&
            /[a-z]/.test(pwd) &&
            /[0-9]/.test(pwd) &&
            /[^A-Za-z0-9]/.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!agreeTerms) { setError('Please agree to the Terms & Conditions and Privacy Policy.'); return; }
        if (!validatePassword(formData.password)) {
            setError('Password must be at least 8 characters with uppercase, lowercase, number and special character.');
            return;
        }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return; }

        try {
            setSubmitting(true);
            const res = await axios.post('http://localhost:5000/api/customers/register', {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: `${formData.phone}`,
                password: formData.password,
            });
            if (res.data.success) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const inputStyle = {
        borderRadius: '50px',
        backgroundColor: '#EDE8DF',
        border: 'none',
        fontSize: '15px',
        color: '#3B2107',
    };

    return (
        <div style={{ backgroundColor: '#F2EEE2', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '40px 0' }}>
            <div className="container">
                <div className="row align-items-center justify-content-center g-0">

                    {/* Left — Image */}
                    <div className="col-md-5 d-none d-md-block pe-4">
                        <div style={{ borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={registerHero}
                                alt="Doctors"
                                style={{ width: '100%', height: '430px', objectFit: 'cover', display: 'block' }}
                            />
                            <div style={{
                                position: 'absolute', inset: 0,
                                backgroundColor: 'rgba(74, 113, 60, 0.45)',
                                borderRadius: '24px',
                            }}></div>
                        </div>
                    </div>

                    {/* Right — Register Form */}
                    <div className="col-md-5 ps-md-4">

                        {/* Back to Home */}
                        <div className="mb-3">
                            <Link to="/" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                color: '#6E491C', textDecoration: 'none', fontSize: '14px', fontWeight: '600',
                            }}>
                                <i className="bi bi-arrow-left"></i> Back to Home
                            </Link>
                        </div>

                        <h3 className="fw-bold text-center mb-4" style={{ color: '#3B2107', fontSize: '32px' }}>
                            Register
                        </h3>

                        {error && (
                            <div className="alert alert-danger py-2 text-center mb-3" style={{ fontSize: '14px', borderRadius: '12px' }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success py-2 text-center mb-3" style={{ fontSize: '14px', borderRadius: '12px' }}>
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* First Name + Last Name */}
                            <div className="row g-2 mb-3">
                                <div className="col-6">
                                    <input
                                        type="text" name="firstName"
                                        className="form-control py-3 px-4"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required style={inputStyle}
                                    />
                                </div>
                                <div className="col-6">
                                    <input
                                        type="text" name="lastName"
                                        className="form-control py-3 px-4"
                                        placeholder="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <input
                                    type="email" name="email"
                                    className="form-control py-3 px-4"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required style={inputStyle}
                                />
                            </div>

                            {/* Phone with country code */}
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-2" style={{
                                    backgroundColor: '#EDE8DF', borderRadius: '50px',
                                    padding: '4px 16px 4px 8px', border: 'none',
                                }}>
                                    <div className="d-flex align-items-center gap-1 pe-2"
                                        style={{ borderRight: '1.5px solid #c5b89a', paddingRight: '10px' }}>
                                        <span style={{ fontSize: '18px' }}>🇦🇪</span>
                                        <i className="bi bi-chevron-down" style={{ fontSize: '12px', color: '#6E491C' }}></i>
                                    </div>
                                  
                                    <input
                                        type="tel" name="phone"
                                        className="py-2 px-2"
                                        placeholder="Phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{
                                            border: 'none', background: 'transparent',
                                            outline: 'none', fontSize: '15px',
                                            color: '#3B2107', width: '100%',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Referral Code */}
                            <div className="mb-3">
                                <input
                                    type="text" name="referralCode"
                                    className="form-control py-3 px-4"
                                    placeholder="Referral Code (Optional)"
                                    value={formData.referralCode}
                                    onChange={handleChange}
                                    style={inputStyle}
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
                                    style={{ ...inputStyle, paddingRight: '50px' }}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '18px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        color: '#8B7355', cursor: 'pointer', padding: 0,
                                    }}>
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '18px' }}></i>
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-3 position-relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    className="form-control py-3 px-4"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    style={{ ...inputStyle, paddingRight: '50px' }}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute', right: '18px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        color: '#8B7355', cursor: 'pointer', padding: 0,
                                    }}>
                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: '18px' }}></i>
                                </button>
                            </div>

                            {/* Password Rules */}
                            <ul className="mb-3 ps-3" style={{ fontSize: '13px', color: '#6E491C' }}>
                                <li>Minimum 8 characters.</li>
                                <li>One uppercase letter, one lowercase letter, one number, and one special character.</li>
                            </ul>

                            {/* Terms & Conditions */}
                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="agreeTerms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    style={{ width: '20px', height: '20px', borderColor: '#6E491C', cursor: 'pointer' }}
                                />
                                <label className="form-check-label ms-2" htmlFor="agreeTerms"
                                    style={{ fontSize: '14px', color: '#3B2107' }}>
                                    I agree with the{' '}
                                    <a href="#" style={{ color: '#3B2107', fontWeight: '700', textDecoration: 'none' }}>Terms & Conditions</a>
                                    {' '}&{' '}
                                    <a href="#" style={{ color: '#3B2107', fontWeight: '700', textDecoration: 'none' }}>Privacy Policy</a>
                                </label>
                            </div>

                            {/* Register Button */}
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
                                {submitting ? 'Creating Account...' : 'Register'}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center mt-4 mb-0" style={{ fontSize: '15px', color: '#6b6375' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ color: '#3B2107', fontWeight: '700', textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CustomerRegister;
