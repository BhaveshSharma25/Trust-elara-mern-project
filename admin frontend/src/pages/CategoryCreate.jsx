import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './categoryDashboard.module.css';
import createStyles from './categoryCreate.module.css';

const API_BASE = 'http://localhost:5000/api/categories';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState('No file chosen');
  const [formData, setFormData] = useState({ name: '', description: '', image: null });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    setFormData((prev) => ({ ...prev, image: file || null }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setError('');
    if (!formData.name.trim()) { setError('Please enter a category name.'); return; }
    try {
      setSubmitting(true);
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      if (formData.image) payload.append('image', formData.image);
      const res = await axios.post(API_BASE, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        navigate('/practice1');
      } else {
        setError(res.data.message || 'Failed to save category.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to the server. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className="d-flex">

        {/* Sidebar — same as CategoryDashboard */}
        <div className={`${styles.sidebar} py-4 flex-shrink-0`}>
          <div className="px-4 mb-4 text-center">
            <div className={`${styles.sidebarBrand} fs-4`}>
              <img src="/images/health-serve-logo.png" alt="logo" height="50px" />
            </div>
            <div className="text-white small fw-bold">FD</div>
          </div>

          <nav className="nav flex-column">
            <div className={styles.hasPopout}>
              <a className={`${styles.navLinkCustom} ${styles.active}`} onClick={() => navigate('/practice1')} style={{ cursor: 'pointer' }}>
                <i className="bi bi-grid-fill me-3"></i> Category
              </a>
              <div className={styles.popoutMenu}>
                <a href="#category" className={`${styles.popoutItem} border-bottom border-secondary border-opacity-25`}>
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
            <a href="#admin-roles" className={styles.navLinkCustom}><i className="bi bi-people me-3"></i> Admin Roles</a>
            <a href="#service-management" className={styles.navLinkCustom}><i className="bi bi-gear me-3"></i> Service Management</a>
            <a href="#service-allocation" className={styles.navLinkCustom}><i className="bi bi-sliders me-3"></i> Service Allocation</a>
            <a className={styles.navLinkCustom} onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-person-check me-3"></i> Registered Users
            </a>
            <a className={styles.navLinkCustom} onClick={() => navigate('/orders')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-journal-text me-3"></i> Bookings
            </a>
            <a href="#collected-cash" className={styles.navLinkCustom}><i className="bi bi-cash-stack me-3"></i> Collected Cash</a>
            <a href="#providers" className={styles.navLinkCustom}><i className="bi bi-person-badge me-3"></i> Providers</a>
            <a href="#practitioners" className={styles.navLinkCustom}><i className="bi bi-person-workspace me-3"></i> Practitioners</a>
            <a href="#manage-reviews" className={styles.navLinkCustom}><i className="bi bi-star me-3"></i> Manage Reviews</a>
            <a href="#manage-earnings" className={`${styles.navLinkCustom} d-flex justify-content-between align-items-center`}>
              <span><i className="bi bi-telephone me-3"></i> Manage Earnings</span>
              <i className="bi bi-chevron-down small text-white-50"></i>
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-grow-1">
          <div className={`${styles.mainWrapper} me-3`}>

            {/* Top Navbar */}
            <div className={`${styles.topNavbar} d-flex justify-content-between align-items-center mb-4`}>
              <h5 className="m-0 fw-semibold text-secondary">Category</h5>
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-outline-secondary btn-sm px-3">English</button>
                <a href="#notifications" className="text-secondary position-relative fs-5">
                  <i className="bi bi-bell"></i>
                </a>
                <div className="dropdown">
                  <a className="nav-link dropdown-toggle fw-semibold text-dark" href="#admin"
                    role="button" data-bs-toggle="dropdown">Admin</a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#profile">Profile</a></li>
                    <li><a className="dropdown-item" href="#settings">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#logout">Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white p-5 rounded-3 shadow-sm">
              <h4 className="fw-semibold mb-1">Category Create</h4>
              <hr className="text-muted opacity-25 mb-4" />

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row mb-4">
                  <label htmlFor="name" className="col-sm-2 col-form-label fw-medium text-secondary">Name</label>
                  <div className="col-sm-10">
                    <input type="text" className="form-control py-2" id="name"
                      placeholder="Enter Name" value={formData.name} onChange={handleChange} required />
                  </div>
                </div>

                <div className="row mb-4">
                  <label className="col-sm-2 col-form-label fw-medium text-secondary">Image</label>
                  <div className="col-sm-10">
                    <div className={createStyles.customFileUpload}>
                      <label htmlFor="categoryImage" className={`${createStyles.btnBrowse} mb-0`} style={{ cursor: 'pointer' }}>
                        <i className="bi bi-image"></i> Choose File
                      </label>
                      <span className={createStyles.fileName}>{fileName}</span>
                      <input type="file" id="categoryImage" className="d-none" onChange={handleFileChange} />
                    </div>
                  </div>
                </div>

                <div className="row mb-4">
                  <label htmlFor="description" className="col-sm-2 col-form-label fw-medium text-secondary">Description</label>
                  <div className="col-sm-10">
                    <textarea className="form-control" id="description" rows="5"
                      placeholder="Enter Description" value={formData.description} onChange={handleChange}></textarea>
                  </div>
                </div>

                {error && (
                  <div className="row mb-3">
                    <div className="col-sm-10 offset-sm-2">
                      <p className="text-danger mb-0" style={{ fontSize: '14px' }}>{error}</p>
                    </div>
                  </div>
                )}

                <div className="row mt-5">
                  <div className="col-sm-10 offset-sm-2 d-flex gap-3 justify-content-center">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/practice1')}>
                      <i className="bi bi-arrow-left me-2"></i> Back to List
                    </button>
                    <button type="button" className="btn btn-success px-4"
                      onClick={handleSave} disabled={submitting}
                      style={{ backgroundColor: '#1F6643', border: 'none' }}>
                      {submitting ? 'Saving...' : 'Save & Publish'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
