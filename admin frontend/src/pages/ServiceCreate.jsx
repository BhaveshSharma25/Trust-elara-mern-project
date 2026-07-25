import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './categoryDashboard.module.css';

const API_BASE = 'http://localhost:5000/api/services';
const CATEGORIES_API = 'http://localhost:5000/api/categories';

const ServiceCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('No file chosen');
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '', categoryId: '', fasting: '', ageGroup: '',
    gender: '', vitalSystem: '', preventiveWellness: '',
    shortDescription: '', longDescription: '',
    keyBenefits: '', whatsMeasured: '', relatedSymptoms: '',
    amount: '', duration: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(CATEGORIES_API);
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : 'No file chosen');
    setImageFile(file || null);
  };

  const handleSave = async () => {
    setError('');
    if (!formData.name.trim()) { setError('Service name is required.'); return; }
    if (!formData.categoryId) { setError('Please select a category.'); return; }
    try {
      setSubmitting(true);
      const payload = new FormData();
      Object.keys(formData).forEach((key) => payload.append(key, formData[key]));
      if (imageFile) payload.append('image', imageFile);

      const res = await axios.post(API_BASE, payload);
      if (res.data.success) {
        navigate('/services');
      } else {
        setError(res.data.message || 'Failed to save service.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to connect to the server. Is the backend running?');
    } finally {
      setSubmitting(false);
    }
  };

  const labelClass = 'col-sm-3 col-form-label fw-medium text-secondary';
  const selectClass = 'form-select py-2';

  return (
    <div className={styles.bodyWrapper}>
      <div className="d-flex">
        {/* Sidebar */}
        <div className={`${styles.sidebar} py-4 flex-shrink-0`}>
          <div className="px-4 mb-4 text-center">
            <div className={`${styles.sidebarBrand} fs-4`}>
              <img src="/images/health-serve-logo.png" alt="logo" height="50px" />
            </div>
            <div className="text-white small fw-bold">FD</div>
          </div>
          <nav className="nav flex-column">
            <div className={styles.hasPopout}>
              <a className={styles.navLinkCustom} onClick={() => navigate('/practice1')} style={{ cursor: 'pointer' }}>
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
            <a className={`${styles.navLinkCustom} ${styles.active}`} onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
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
            <div className={`${styles.topNavbar} d-flex justify-content-between align-items-center mb-4`}>
              <h5 className="m-0 fw-semibold text-secondary">Services</h5>
              <div className="d-flex align-items-center gap-3">
                <button className="btn btn-outline-secondary btn-sm px-3">English</button>
                <a href="#notifications" className="text-secondary position-relative fs-5"><i className="bi bi-bell"></i></a>
                <div className="dropdown">
                  <a className="nav-link dropdown-toggle fw-semibold text-dark" href="#admin" role="button" data-bs-toggle="dropdown">Admin</a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="#profile">Profile</a></li>
                    <li><a className="dropdown-item" href="#logout">Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3 shadow-sm">
              <h4 className="fw-semibold mb-1">Create New Service</h4>
              <hr className="text-muted opacity-25 mb-4" />

              <form onSubmit={(e) => e.preventDefault()}>

                {/* Service Name */}
                <div className="row mb-4">
                  <label className={labelClass}>Service Name <span className="text-danger">*</span></label>
                  <div className="col-sm-9">
                    <input type="text" className="form-control py-2" name="name"
                      placeholder="Enter service name" value={formData.name} onChange={handleChange} />
                  </div>
                </div>

                {/* Service Image */}
                <div className="row mb-4">
                  <label className={labelClass}>Service Image</label>
                  <div className="col-sm-9">
                    <div style={{ border: '1px solid #ced4da', borderRadius: '0.375rem', display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
                      <label htmlFor="serviceImage" style={{ backgroundColor: '#E2E8F0', border: 'none', borderRight: '1px solid #ced4da', padding: '6px 20px', color: '#4A5568', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <i className="bi bi-image"></i> Choose File
                      </label>
                      <span style={{ padding: '6px 15px', color: '#718096', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>{fileName}</span>
                      <input type="file" id="serviceImage" className="d-none" onChange={handleFileChange} />
                    </div>
                  </div>
                </div>

                {/* Service Category */}
                <div className="row mb-4">
                  <label className={labelClass}>Service Category <span className="text-danger">*</span></label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="categoryId" value={formData.categoryId} onChange={handleChange}>
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount */}
                <div className="row mb-4">
                  <label className={labelClass}>Price (AED)</label>
                  <div className="col-sm-9">
                    <input type="number" className="form-control py-2" name="amount"
                      placeholder="Enter price in AED" value={formData.amount} onChange={handleChange} min="0" />
                  </div>
                </div>

                {/* Fasting */}
                <div className="row mb-4">
                  <label className={labelClass}>Fasting</label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="fasting" value={formData.fasting} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>

                {/* Age Group */}
                <div className="row mb-4">
                  <label className={labelClass}>Age Group</label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
                      <option value="">Select Age Group</option>
                      <option value="more_than_65">More than 65</option>
                      <option value="41_to_65">41 to 65</option>
                      <option value="18_to_40">18 to 40</option>
                      <option value="less_than_18">Less than 18</option>
                    </select>
                  </div>
                </div>

                {/* Gender */}
                <div className="row mb-4">
                  <label className={labelClass}>Gender</label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Vital System */}
                <div className="row mb-4">
                  <label className={labelClass}>Vital System</label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="vitalSystem" value={formData.vitalSystem} onChange={handleChange}>
                      <option value="">Select Vital System</option>
                      <option value="heart">Heart</option>
                      <option value="hormonal">Hormonal</option>
                      <option value="kidney">Kidney</option>
                      <option value="lungs">Lungs</option>
                      <option value="guts">Guts</option>
                      <option value="reproductive">Reproductive</option>
                      <option value="mental_health">Mental Health</option>
                      <option value="hair">Hair</option>
                      <option value="bone">Bone</option>
                      <option value="liver">Liver</option>
                    </select>
                  </div>
                </div>

                {/* Preventive Wellness */}
                <div className="row mb-4">
                  <label className={labelClass}>Preventive Wellness</label>
                  <div className="col-sm-9">
                    <select className={selectClass} name="preventiveWellness" value={formData.preventiveWellness} onChange={handleChange}>
                      <option value="">Select Preventive Wellness</option>
                      <option value="weight_management">Weight Management</option>
                      <option value="allergy_and_intolerance">Allergy and Intolerance</option>
                      <option value="cancer_risk">Cancer Risk</option>
                      <option value="genetics">Genetics</option>
                      <option value="antiaging">Antiaging</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div className="row mb-4">
                  <label className={labelClass}>Short Description</label>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="shortDescription" rows="3"
                      placeholder="Enter a brief summary" value={formData.shortDescription} onChange={handleChange}></textarea>
                    <small className="text-muted">Keep it under 150 characters</small>
                  </div>
                </div>

                {/* Long Description */}
                <div className="row mb-4">
                  <label className={labelClass}>Long Description</label>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="longDescription" rows="5"
                      placeholder="Enter a detailed description" value={formData.longDescription} onChange={handleChange}></textarea>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="row mb-4">
                  <label className={labelClass}>Key Benefits</label>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="keyBenefits" rows="3"
                      placeholder="Enter key benefits (one per line)" value={formData.keyBenefits} onChange={handleChange}></textarea>
                  </div>
                </div>

                {/* What's Measured */}
                <div className="row mb-4">
                  <label className={labelClass}>What's Measured</label>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="whatsMeasured" rows="3"
                      placeholder="Enter what's measured (one per line)" value={formData.whatsMeasured} onChange={handleChange}></textarea>
                  </div>
                </div>

                {/* Related Symptoms */}
                <div className="row mb-4">
                  <label className={labelClass}>Related Symptoms</label>
                  <div className="col-sm-9">
                    <textarea className="form-control" name="relatedSymptoms" rows="3"
                      placeholder="Enter related symptoms (one per line)" value={formData.relatedSymptoms} onChange={handleChange}></textarea>
                  </div>
                </div>

                {error && (
                  <div className="row mb-3">
                    <div className="col-sm-9 offset-sm-3">
                      <p className="text-danger mb-0" style={{ fontSize: '14px' }}>{error}</p>
                    </div>
                  </div>
                )}

                <div className="row mt-5">
                  <div className="col-sm-9 offset-sm-3 d-flex gap-3 justify-content-center">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate('/services')}>
                      <i className="bi bi-arrow-left me-2"></i> Back to List
                    </button>
                    <button type="button" className="btn btn-success px-4" onClick={handleSave} disabled={submitting}
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

export default ServiceCreate;
