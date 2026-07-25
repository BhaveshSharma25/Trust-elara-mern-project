import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from './categoryDashboard.module.css';

const API_BASE = 'http://localhost:5000/api/orders';

const STATUS_COLORS = {
  pending:          { bg: '#FEF3C7', text: '#92400E' },
  confirmed:        { bg: '#DBEAFE', text: '#1E40AF' },
  shipped:          { bg: '#E6F4FF', text: '#1D4ED8' },
  out_for_delivery: { bg: '#FEF3C7', text: '#D97706' },
  delivered:        { bg: '#D1FAE5', text: '#065F46' },
  completed:        { bg: '#D1FAE5', text: '#065F46' },
  cancelled:        { bg: '#FEE2E2', text: '#991B1B' },
};

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE);
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      setError('Failed to load orders. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.patch(`${API_BASE}/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      setError('Failed to delete order.');
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o._id.slice(-6).includes(search);
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const summary = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    out_for_delivery: orders.filter((o) => o.status === 'out_for_delivery').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

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
            <a className={styles.navLinkCustom} onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
              <i className="bi bi-person-check me-3"></i> Registered Users
            </a>
            <a className={`${styles.navLinkCustom} ${styles.active}`} style={{ cursor: 'pointer' }}>
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
              <h5 className="m-0 fw-semibold text-secondary">Bookings / Orders</h5>
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

            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              {[
                { label: 'Total Orders', value: summary.total, icon: 'bi-journal-text', color: '#1F6643' },
                { label: 'Pending', value: summary.pending, icon: 'bi-clock', color: '#92400E' },
                { label: 'Confirmed', value: summary.confirmed, icon: 'bi-check-circle', color: '#1E40AF' },
                { label: 'Shipped', value: summary.shipped, icon: 'bi-truck', color: '#2563EB' },
                { label: 'Out for Delivery', value: summary.out_for_delivery, icon: 'bi-truck-flatbed', color: '#D97706' },
                { label: 'Delivered', value: summary.delivered, icon: 'bi-bag-check', color: '#065F46' },
                { label: 'Cancelled', value: summary.cancelled, icon: 'bi-x-circle', color: '#991B1B' },
              ].map((card) => (
                <div className="col" key={card.label}>
                  <div className="bg-white rounded-3 shadow-sm p-3 d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px', backgroundColor: card.color + '20' }}>
                      <i className={`bi ${card.icon}`} style={{ color: card.color, fontSize: '1.2rem' }}></i>
                    </div>
                    <div>
                      <div className="fw-bold fs-5" style={{ color: card.color }}>{card.value}</div>
                      <div className="text-muted small">{card.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-3 rounded-3 shadow-sm mb-4">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Search by customer, service or order ID"
                    value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="col-auto">
                  <select className="form-select form-select-sm text-secondary" style={{ minWidth: '150px' }}
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-auto">
                  <input type="date" className="form-control form-select-sm" />
                </div>
                <div className="col-auto text-secondary small">-</div>
                <div className="col-auto">
                  <input type="date" className="form-control form-select-sm" />
                </div>
                <div className="col-auto">
                  <button className="btn btn-outline-secondary btn-sm bg-light px-3"
                    onClick={() => { setSearch(''); setStatusFilter(''); }}>
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className={`${styles.tableContainer} shadow-sm`}>
              <table className="table table-hover align-middle mb-0 text-secondary">
                <thead className="table-light text-dark fw-semibold">
                  <tr>
                    <th className="py-3">S. No.</th>
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Service</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Order Date</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="8" className="text-center py-4 text-muted">Loading orders...</td></tr>
                  )}
                  {!loading && error && (
                    <tr><td colSpan="8" className="text-center py-4 text-danger">{error}</td></tr>
                  )}
                  {!loading && !error && filtered.length === 0 && (
                    <tr><td colSpan="8" className="text-center py-4 text-muted">
                      No orders found. Orders will appear here once customers place them.
                    </td></tr>
                  )}
                  {!loading && !error && filtered.map((order, index) => {
                    const colors = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={order._id}>
                        <td className="ps-3">{index + 1}</td>
                        <td>
                          <span className="fw-medium text-dark">#{order._id.slice(-6).toUpperCase()}</span>
                          <i className="bi bi-copy text-muted ms-2" style={{ cursor: 'pointer', fontSize: '12px' }}
                            onClick={() => navigator.clipboard.writeText(order._id)}></i>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                              style={{ width: '32px', height: '32px', fontSize: '12px', backgroundColor: '#1F6643', flexShrink: 0 }}>
                              {order.customerId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="text-dark fw-medium" style={{ fontSize: '14px' }}>
                                {order.customerId?.name || '-'}
                              </div>
                              <div className="text-muted" style={{ fontSize: '12px' }}>
                                {order.customerId?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="text-dark fw-medium">{order.serviceId?.name || '-'}</td>
                        <td className="text-dark fw-medium">₹{order.amount?.toLocaleString('en-IN')}</td>
                        <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}</td>
                        <td>
                          <select
                            className="form-select form-select-sm border-0 fw-medium"
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              width: '160px',
                              borderRadius: '20px',
                              fontSize: '13px',
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" title="View Details"
                              onClick={() => navigate(`/orders/${order._id}`)}>
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" title="Delete"
                              onClick={() => handleDelete(order._id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
