
import { useMemo, useState } from 'react';
import './Subscriptions.css';

const initialSubscriptions = [
  {
    id: 'SUB-1001',
    customer: 'Acme Technologies',
    product: 'Odoo',
    plan: 'Enterprise Yearly',
    amount: 12000,
    startDate: '2026-10-01',
    nextBilling: '2027-10-01',
    status: 'Active',
  },
  {
    id: 'SUB-1002',
    customer: 'Pixel Studios',
    product: 'Cloud Services',
    plan: 'Professional Monthly',
    amount: 6000,
    startDate: '2026-10-10',
    nextBilling: '2026-11-10',
    status: 'Active',
  },
  {
    id: 'SUB-1003',
    customer: 'Nova Solutions',
    product: 'Technical Support',
    plan: 'Basic Monthly',
    amount: 2500,
    startDate: '2026-10-15',
    nextBilling: '2026-11-15',
    status: 'Quotation',
  },
  {
    id: 'SUB-1004',
    customer: 'Cloudify Labs',
    product: 'Odoo',
    plan: 'Professional Yearly',
    amount: 12000,
    startDate: '2026-10-20',
    nextBilling: '2027-10-20',
    status: 'Confirmed',
  },
  {
    id: 'SUB-1005',
    customer: 'Bright Digital',
    product: 'Website Development',
    plan: 'Basic Monthly',
    amount: 6000,
    startDate: '2026-09-01',
    nextBilling: '2026-10-01',
    status: 'Closed',
  },
];

const emptySubscription = {
  customer: '',
  product: '',
  plan: '',
  amount: '',
  startDate: '',
  nextBilling: '',
  status: 'Draft',
};

const statuses = ['Draft', 'Quotation', 'Confirmed', 'Active', 'Closed'];

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [form, setForm] = useState(emptySubscription);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((item) => {
      const matchesSearch =
        `${item.id} ${item.customer} ${item.product} ${item.plan}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter = filter === 'All' || item.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [subscriptions, search, filter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptySubscription);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptySubscription);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.customer.trim() ||
      !form.product ||
      !form.plan.trim() ||
      form.amount === '' ||
      Number(form.amount) < 0 ||
      !form.startDate
    ) {
      alert('Please complete all required fields.');
      return;
    }

    if (form.nextBilling && form.nextBilling < form.startDate) {
      alert('Next billing date cannot be earlier than the start date.');
      return;
    }

    const subscriptionData = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId) {
      setSubscriptions((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...subscriptionData, id: editingId }
            : item
        )
      );
    } else {
      const newId = `SUB-${Date.now().toString().slice(-6)}`;
      setSubscriptions((previous) => [
        ...previous,
        { ...subscriptionData, id: newId },
      ]);
    }

    closeModal();
  };

  const updateStatus = (id, status) => {
    setSubscriptions((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const deleteSubscription = (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  const counts = statuses.reduce((result, status) => {
    result[status] = subscriptions.filter(
      (item) => item.status === status
    ).length;
    return result;
  }, {});

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-heading">
        <div>
          <h2>Subscriptions</h2>
          <p>Manage customer subscriptions and their lifecycle.</p>
        </div>

        <button className="sub-primary-btn" onClick={openAddModal}>
          + New Subscription
        </button>
      </div>

      <div className="sub-stats-grid">
        <div className="sub-stat-card">
          <span>Total Subscriptions</span>
          <h3>{subscriptions.length}</h3>
        </div>
        <div className="sub-stat-card">
          <span>Active</span>
          <h3>{counts.Active}</h3>
        </div>
        <div className="sub-stat-card">
          <span>Pending / In Progress</span>
          <h3>{counts.Draft + counts.Quotation + counts.Confirmed}</h3>
        </div>
        <div className="sub-stat-card">
          <span>Closed</span>
          <h3>{counts.Closed}</h3>
        </div>
      </div>

      <div className="sub-toolbar">
        <input
          type="text"
          placeholder="Search ID, customer, product or plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="sub-table-container">
        <table className="sub-table">
          <thead>
            <tr>
              <th>Subscription ID</th>
              <th>Customer</th>
              <th>Product / Plan</th>
              <th>Amount</th>
              <th>Start Date</th>
              <th>Next Billing</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSubscriptions.length > 0 ? (
              filteredSubscriptions.map((item) => (
                <tr key={item.id}>
                  <td className="sub-id-cell">{item.id}</td>
                  <td className="sub-customer-cell">{item.customer}</td>
                  <td>
                    <strong>{item.product}</strong>
                    <span className="sub-plan-name">{item.plan}</span>
                  </td>
                  <td>₹{item.amount.toLocaleString('en-IN')}</td>
                  <td>{item.startDate}</td>
                  <td>{item.nextBilling || 'Not set'}</td>
                  <td>
                    <span className={`sub-status sub-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="sub-actions">
                      <button onClick={() => setSelectedSubscription(item)}>
                        View
                      </button>
                      <button onClick={() => openEditModal(item)}>
                        Edit
                      </button>
                      <button
                        className="sub-delete-btn"
                        onClick={() => deleteSubscription(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="sub-empty">
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="sub-modal-overlay" onClick={closeModal}>
          <div className="sub-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal-heading">
              <div>
                <h3>{editingId ? 'Edit Subscription' : 'Create Subscription'}</h3>
                <p>Enter the customer and subscription details.</p>
              </div>
              <button type="button" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sub-form-grid">
                <div className="sub-form-group">
                  <label>Customer Name *</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label>Product *</label>
                  <select name="product" value={form.product} onChange={handleChange} required>
                    <option value="">Select product</option>
                    <option>Odoo</option>
                    <option>Technical Support</option>
                    <option>Cloud Services</option>
                    <option>Website Development</option>
                  </select>
                </div>

                <div className="sub-form-group">
                  <label>Plan *</label>
                  <input
                    name="plan"
                    value={form.plan}
                    onChange={handleChange}
                    placeholder="Enter plan name"
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sub-form-group">
                  <label>Next Billing Date</label>
                  <input
                    type="date"
                    name="nextBilling"
                    min={form.startDate || undefined}
                    value={form.nextBilling}
                    onChange={handleChange}
                  />
                </div>

                <div className="sub-form-group">
                  <label>Lifecycle Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sub-modal-footer">
                <button type="button" className="sub-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="sub-primary-btn">
                  {editingId ? 'Save Changes' : 'Create Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSubscription && (
        <div
          className="sub-modal-overlay"
          onClick={() => setSelectedSubscription(null)}
        >
          <div className="sub-modal sub-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sub-modal-heading">
              <div>
                <h3>Subscription Details</h3>
                <p>{selectedSubscription.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedSubscription(null)}>×</button>
            </div>

            <div className="sub-details-list">
              <p><strong>Customer:</strong> {selectedSubscription.customer}</p>
              <p><strong>Product:</strong> {selectedSubscription.product}</p>
              <p><strong>Plan:</strong> {selectedSubscription.plan}</p>
              <p><strong>Amount:</strong> ₹{selectedSubscription.amount.toLocaleString('en-IN')}</p>
              <p><strong>Start Date:</strong> {selectedSubscription.startDate}</p>
              <p><strong>Next Billing:</strong> {selectedSubscription.nextBilling || 'Not set'}</p>
              <p><strong>Status:</strong> {selectedSubscription.status}</p>
            </div>

            <div className="sub-modal-footer">
              <button
                className="sub-cancel-btn"
                onClick={() => setSelectedSubscription(null)}
              >
                Close
              </button>

              <select
                value={selectedSubscription.status}
                onChange={(e) => {
                  updateStatus(selectedSubscription.id, e.target.value);
                  setSelectedSubscription({
                    ...selectedSubscription,
                    status: e.target.value,
                  });
                }}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscriptions;
