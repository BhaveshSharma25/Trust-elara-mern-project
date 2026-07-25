import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './categoryDashboard.module.css';

const API_BASE = 'http://localhost:5000/api/customers';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      if (res.data.success) setCustomers(res.data.customers);
    } catch (err) {
      setError('Failed to load customers. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${API_BASE}/${id}/status`, { active: !currentStatus });
      setCustomers((prev) =>
        prev.map((c) => (c._id === id ? { ...c, active: !currentStatus } : c))
      );
    } catch (err) {
      setError('Failed to update customer status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError('Failed to delete customer.');
    }
  };

  const filtered = customers.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

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
            <a className={styles.navLinkCustom} onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-geo-alt me-3"></i> Services
            </a>
            <a href="#admin-roles" className={styles.navLinkCustom}><i className="bi bi-people me-3"></i> Admin Roles</a>
            <a href="#service-management" className={styles.navLinkCustom}><i className="bi bi-gear me-3"></i> Service Management</a>
            <a href="#service-allocation" className={styles.navLinkCustom}><i className="bi bi-sliders me-3"></i> Service Allocation</a>
            <a className={`${styles.navLinkCustom} ${styles.active}`} style={{ cursor: 'pointer' }}>
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
              <h5 className="m-0 fw-semibold text-secondary">Registered Users</h5>
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
                    <li><a className="dropdown-item" href="#logout">Logout</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-3 rounded-3 shadow-sm mb-4">
              <div className="row g-3 justify-content-between align-items-center mb-3">
                <div className="col-md-4 col-lg-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email or phone"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-auto">
                  <span className="text-muted small">
                    Total: <strong>{filtered.length}</strong> customers
                  </span>
                </div>
              </div>

              <div className="row g-2 align-items-center">
                <div className="col-auto">
                  <select className="form-select form-select-sm text-secondary" style={{ minWidth: '140px' }}>
                    <option>Status Filter</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div className="col-auto">
                  <input type="date" className="form-control form-select-sm text-secondary" placeholder="From Date" />
                </div>
                <div className="col-auto text-secondary small">-</div>
                <div className="col-auto">
                  <input type="date" className="form-control form-select-sm text-secondary" placeholder="To Date" />
                </div>
                <div className="col-auto">
                  <button className="btn btn-outline-secondary btn-sm bg-light px-3"
                    onClick={() => setSearch('')}>Clear Filters</button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className={`${styles.tableContainer} shadow-sm`}>
              <table className="table table-hover align-middle mb-0 text-secondary">
                <thead className="table-light text-dark fw-semibold">
                  <tr>
                    <th className="py-3">S. No.</th>
                    <th className="py-3">Customer ID</th>
                    <th className="py-3">Name <i className="bi bi-arrow-down-up small ms-1 text-muted"></i></th>
                    <th className="py-3">Email</th>
                    <th className="py-3">Phone</th>
                    <th className="py-3">Joined On</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="8" className="text-center py-4 text-muted">Loading customers...</td></tr>
                  )}
                  {!loading && error && (
                    <tr><td colSpan="8" className="text-center py-4 text-danger">{error}</td></tr>
                  )}
                  {!loading && !error && filtered.length === 0 && (
                    <tr><td colSpan="8" className="text-center py-4 text-muted">No customers found.</td></tr>
                  )}
                  {!loading && !error && filtered.map((customer, index) => (
                    <tr key={customer._id}>
                      <td className="ps-3">{index + 1}</td>
                      <td>
                        {customer._id.slice(-6)}{' '}
                        <i className="bi bi-copy text-muted ms-1" style={{ cursor: 'pointer' }}
                          onClick={() => navigator.clipboard.writeText(customer._id)}></i>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '34px', height: '34px', fontSize: '13px', backgroundColor: '#1F6643' }}>
                            {customer.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-dark fw-medium">{customer.name || '-'}</span>
                        </div>
                      </td>
                      <td>{customer.email || '-'}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-GB') : '-'}</td>
                      <td>
                        <div className="form-check form-switch fs-5">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={customer.active}
                            onChange={() => handleToggleStatus(customer._id, customer.active)}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="View Details"
                            onClick={() => navigate(`/customers/${customer._id}`)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Delete"
                            onClick={() => handleDelete(customer._id, customer.name)}
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

export default CustomerList;
