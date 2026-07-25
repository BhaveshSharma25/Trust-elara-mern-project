import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './categoryDashboard.module.css';

const API_BASE = 'http://localhost:5000/api/categories';

const renderThumb = (cat) => {
  if (cat.image) {
    return (
      <img
        src={`http://localhost:5000/uploads/${cat.image}`}
        alt={cat.name}
        className={styles.categoryThumb}
      />
    );
  }
  return (
    <div
      className={`bg-light border text-center rounded d-flex align-items-center justify-content-center ${styles.categoryThumb}`}
    >
      <i className="bi bi-image text-muted fs-4"></i>
    </div>
  );
};

const CategoryDashboard = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setError('Failed to load categories. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}/status`, { active: !currentStatus });
      setCategories((prev) =>
        prev.map((cat) => (cat._id === id ? { ...cat, active: !currentStatus } : cat))
      );
    } catch (err) {
      setError('Failed to update category status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setCategories((prev) => prev.filter((cat) => cat._id !== id));
    } catch (err) {
      setError('Failed to delete category.');
    }
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className="d-flex">
        {/* Sidebar */}
        <div className={`${styles.sidebar} py-4 flex-shrink-0`}>
          <div className="px-4 mb-4 text-center">
            <div className={`${styles.sidebarBrand} fs-4`}>
              <img
                src="/images/health-serve-logo.png"
                alt="logo"
                height="50px"
              />
            </div>
            <div className="text-white small fw-bold">FD</div>
          </div>

          <nav className="nav flex-column">
            <div className={styles.hasPopout}>
              <a href="#category" className={`${styles.navLinkCustom} ${styles.active}`}>
                <i className="bi bi-grid-fill me-3"></i> Category
                <i className="bi bi-chevron-right ms-auto d-none"></i>
              </a>

              <div className={styles.popoutMenu}>
                <a
                  href="#category"
                  className={`${styles.popoutItem} border-bottom border-secondary border-opacity-25`}
                >
                  <i className="bi bi-triangle-fill small me-2"></i> Category
                </a>
                <a href="#subcategory" className={styles.popoutItem}>
                  <i className="bi bi-arrow-return-right small me-2"></i> Sub Category
                </a>
              </div>
            </div>

            <a className={styles.navLinkCustom} onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-geo-alt me-3"></i> Services
            </a>
            <a href="#admin-roles" className={styles.navLinkCustom}>
              <i className="bi bi-people me-3"></i> Admin Roles
            </a>
            <a href="#service-management" className={styles.navLinkCustom}>
              <i className="bi bi-gear me-3"></i> Service Management
            </a>
            <a href="#service-allocation" className={styles.navLinkCustom}>
              <i className="bi bi-sliders me-3"></i> Service Allocation
            </a>
            <a className={styles.navLinkCustom} onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-person-check me-3"></i> Registered Users
            </a>
            <a className={styles.navLinkCustom} onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-journal-text me-3"></i> Bookings
            </a>
            <a href="#collected-cash" className={styles.navLinkCustom}>
              <i className="bi bi-cash-stack me-3"></i> Collected Cash
            </a>
            <a href="#providers" className={styles.navLinkCustom}>
              <i className="bi bi-person-badge me-3"></i> Providers
            </a>
            <a href="#practitioners" className={styles.navLinkCustom}>
              <i className="bi bi-person-workspace me-3"></i> Practitioners
            </a>
            <a href="#manage-reviews" className={styles.navLinkCustom}>
              <i className="bi bi-star me-3"></i> Manage Reviews
            </a>
            <a
              href="#manage-earnings"
              className={`${styles.navLinkCustom} d-flex justify-content-between align-items-center`}
            >
              <span>
                <i className="bi bi-telephone me-3"></i> Manage Earnings
              </span>
              <i className="bi bi-chevron-down small text-white-50"></i>
            </a>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-grow-1">
          <div className={`${styles.mainWrapper} me-3`}>
            <div
              className={`${styles.topNavbar} d-flex justify-content-between align-items-center mb-4`}
            >
              <h5 className="m-0 fw-semibold text-secondary">Category</h5>
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-outline-secondary btn-sm px-3">English</button>
                <a href="#notifications" className="text-secondary position-relative fs-5">
                  <i className="bi bi-bell"></i>
                  <span className="position-absolute top-0 start-100 translate-middle p-1"></span>
                </a>
                <div className="dropdown">
                  <a
                    className="nav-link dropdown-toggle fw-semibold text-dark"
                    href="#admin-menu"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    Admin
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#profile">
                        Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#logout">
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-3 shadow-sm mb-4">
              <div className="row g-3 justify-content-between align-items-center mb-3">
                <div className="col-md-4 col-lg-3">
                  <input type="text" className="form-control" placeholder="Search" />
                </div>
                <div className="col-auto">
                  <button type="button" className="btn btn-success" onClick={() => navigate('/category/create')}>
                    Create New Category
                  </button>
                </div>
              </div>

              <div className="row g-2 align-items-center">
                <div className="col-auto">
                  <select
                    className="form-select form-select-sm text-secondary"
                    style={{ minWidth: '140px' }}
                  >
                    <option>Status Filter</option>
                  </select>
                </div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control form-select-sm text-secondary"
                    placeholder="From Date"
                  />
                </div>
                <div className="col-auto text-secondary small">-</div>
                <div className="col-auto">
                  <input
                    type="text"
                    className="form-control form-select-sm text-secondary"
                    placeholder="To Date"
                  />
                </div>
                <div className="col-auto">
                  <button className="btn btn-outline-secondary btn-sm text-secondary bg-light px-3">
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            <div className={`${styles.tableContainer} shadow-sm`}>
              <table className="table table-hover align-middle mb-0 text-secondary">
                <thead className="table-light text-dark fw-semibold">
                  <tr>
                    <th scope="col" className="py-3">S. No.</th>
                    <th scope="col" className="py-3">Category ID</th>
                    <th scope="col" className="py-3">
                      Category Name <i className="bi bi-arrow-down-up small ms-1 text-muted"></i>
                    </th>
                    <th scope="col" className="py-3">Category Image</th>
                    <th scope="col" className="py-3">Description</th>
                    <th scope="col" className="py-3">Status</th>
                    <th scope="col" className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        Loading categories...
                      </td>
                    </tr>
                  )}
                  {!loading && error && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-danger">
                        {error}
                      </td>
                    </tr>
                  )}
                  {!loading && !error && categories.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
                        No categories found. Click "Create New Category" to add one.
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    !error &&
                    categories.map((cat, index) => (
                      <tr key={cat._id}>
                        <td className="ps-3">{index + 1}</td>
                        <td>
                          {cat._id.slice(-6)}{' '}
                          <i className="bi bi-copy text-muted ms-1" style={{ cursor: 'pointer' }}></i>
                        </td>
                        <td className="text-dark fw-medium">{cat.name}</td>
                        <td>{renderThumb(cat)}</td>
                        <td>{cat.description || '-'}</td>
                        <td>
                          <div className="form-check form-switch fs-5">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={cat.active}
                              onChange={() => handleToggleStatus(cat._id, cat.active)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                              onClick={() => navigate(`/category/edit/${cat._id}`)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => handleDelete(cat._id, cat.name)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDashboard;
