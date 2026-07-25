import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Header = () => {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        };
        updateCount();
        window.addEventListener('storage', updateCount);
        return () => window.removeEventListener('storage', updateCount);
    }, []);

    // fetch categories to show under Doctor Visit dropdown
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        let mounted = true;
        const fetchCats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/categories');
                const data = await res.json();
                if (mounted && data.success) setCategories(data.categories);
            } catch (err) {
                // ignore
            }
        };
        fetchCats();
        return () => { mounted = false; };
    }, []);

    // Check if customer is logged in
    const customerName = localStorage.getItem('customerName');

    const handleLogout = () => {
        localStorage.removeItem('customerId');
        localStorage.removeItem('customerName');
        navigate('/');
        window.location.reload();
    };

    return (
        <>
            <header className="headerWrapper">
                <div className="realHeader">
                    {/* Top offer bar */}
                    <div className="offerRow">
                        <div className="container">
                            <div className="row">
                                <div className="col-6">
                                    <div className="offerLine">
                                        <p>End this year strong! <span>Get 25% SITEWIDE with code NEWME</span></p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="headerDropdown">
                                        <div className="language">
                                            <select>
                                                <option value="en">English</option>
                                                <option value="fr">French</option>
                                            </select>
                                        </div>
                                        <div className="city">
                                            <select>
                                                <option value="">Select city</option>
                                                <option value="ny">New York</option>
                                                <option value="to">Tokyo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Logo + Search + Icons */}
                    <div className="logo_with_search">
                        <div className="container">
                            <div className="logoSearch_flex">
                                <div className="logoContainer">
                                    <div className="logo">
                                        <img src="/Images/health-serve-logo.png" alt="logo" />
                                    </div>
                                    <div className="searchBar">
                                        <img className="search-icon" src="/Images/search-icon.svg" alt="search" />
                                        <form>
                                            <input className="searchInput" type="search" name="query"
                                                placeholder="Search for Therapy, Nurse Care ..." />
                                        </form>
                                    </div>
                                </div>

                                <div className="profile_cart">
                                    {/* Cart Icon */}
                                    <div className="cartIcon position-relative">
                                        <a onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}
                                            className="btn no-arrow p-0" aria-label="Cart">
                                            <img src="/Images/cart-icon.svg" className="rounded-circle"
                                                width="40" height="40" alt="Cart" />
                                        </a>
                                        {cartCount > 0 && (
                                            <span style={{
                                                position: 'absolute', top: '-6px', right: '-6px',
                                                backgroundColor: '#6E491C', color: 'white',
                                                borderRadius: '50%', width: '18px', height: '18px',
                                                fontSize: '11px', fontWeight: '700',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>

                                        {/* Home Icon (styled bold to match profile) */}
                                        <div className="homeIcon position-relative ms-3">
                                            <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}
                                                className="btn no-arrow p-0" aria-label="Home">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '44px', height: '44px', border: '2px solid #2e2e2e', background: 'white' }}>
                                                    <i className="bi bi-house-fill" style={{ fontSize: '18px', color: '#6E491C' }}></i>
                                                </div>
                                            </a>
                                        </div>

                                    {/* User Icon Dropdown */}
                                    <div className="user_icon dropdown">
                                        <button className="btn no-arrow p-0" type="button"
                                            data-bs-toggle="dropdown" aria-label="User Menu"
                                            aria-expanded="false">
                                            <img src="/Images/user-icon.svg" className="rounded-circle"
                                                width="40" height="40" alt="Profile" />
                                        </button>

                                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 p-2"
                                            style={{ minWidth: '200px', borderRadius: '12px' }}>

                                            {customerName ? (
                                                // Logged in state
                                                <>
                                                    <li className="px-3 py-2">
                                                        <span className="fw-semibold" style={{ color: '#6E491C' }}>
                                                            Hi, {customerName} 👋
                                                        </span>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <Link className="dropdown-item rounded-2" to="/profile">
                                                            My Profile
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link className="dropdown-item rounded-2" to="/my-orders">
                                                            My Orders
                                                        </Link>
                                                    </li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li>
                                                        <button className="dropdown-item rounded-2 text-danger"
                                                            onClick={handleLogout}
                                                            style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}>
                                                            Logout
                                                        </button>
                                                    </li>
                                                </>
                                            ) : (
                                                // Logged out state — show Login & Register
                                                <>
                                                    <li className="p-1">
                                                        <Link to="/login"
                                                            className="d-block text-center py-2 px-3 rounded-pill fw-medium"
                                                            style={{
                                                                border: '1.5px solid #6E491C',
                                                                color: '#6E491C',
                                                                textDecoration: 'none',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.target.style.backgroundColor = '#6E491C';
                                                                e.target.style.color = 'white';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#6E491C';
                                                            }}
                                                        >
                                                            Login
                                                        </Link>
                                                    </li>
                                                    <li className="p-1 mt-1">
                                                        <Link to="/register"
                                                            className="d-block text-center py-2 px-3 rounded-pill fw-medium"
                                                            style={{
                                                                border: '1.5px solid #6E491C',
                                                                color: '#6E491C',
                                                                textDecoration: 'none',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.target.style.backgroundColor = '#6E491C';
                                                                e.target.style.color = 'white';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.target.style.backgroundColor = 'transparent';
                                                                e.target.style.color = '#6E491C';
                                                            }}
                                                        >
                                                            Register
                                                        </Link>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="menus">
                        <div className="container">
                            <div className="menuContainer">
                                {categories.length === 0 ? (
                                    <button className="btn menuDropdown" type="button" disabled>
                                        Loading categories...
                                    </button>
                                ) : (
                                    categories.map((cat) => (
                                        cat.active ? (
                                            <Link
                                                key={cat._id}
                                                to={`/category/${cat._id}`}
                                                className="btn menuDropdown"
                                                style={{ textTransform: 'none' }}
                                            >
                                                {cat.name}
                                            </Link>
                                        ) : (
                                            <button
                                                key={cat._id}
                                                className="btn menuDropdown"
                                                style={{ textTransform: 'none', opacity: 0.5, cursor: 'not-allowed' }}
                                                title="Category unavailable"
                                                disabled
                                            >
                                                {cat.name} <span style={{ fontSize: '11px', marginLeft: '8px', color: '#6B5840' }}>Unavailable</span>
                                            </button>
                                        )
                                    ))
                                )}
                                <button
                                    className="btn menuDropdown"
                                    onClick={() => navigate('/categories')}
                                    style={{ textTransform: 'none' }}
                                >
                                    Others
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
