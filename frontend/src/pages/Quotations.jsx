
import { useMemo, useState } from 'react';
import './Quotations.css';

const initialQuotations = [
  {
    id: 'QUO-1001',
    customer: 'Acme Technologies',
    product: 'Odoo',
    plan: 'Enterprise Yearly',
    amount: 12000,
    date: '2026-10-20',
    validUntil: '2026-11-20',
    status: 'Sent',
  },
  {
    id: 'QUO-1002',
    customer: 'Pixel Studios',
    product: 'Cloud Services',
    plan: 'Professional Monthly',
    amount: 6000,
    date: '2026-10-22',
    validUntil: '2026-11-22',
    status: 'Accepted',
  },
  {
    id: 'QUO-1003',
    customer: 'Nova Solutions',
    product: 'Technical Support',
    plan: 'Basic Monthly',
    amount: 2500,
    date: '2026-10-25',
    validUntil: '2026-11-25',
    status: 'Draft',
  },
  {
    id: 'QUO-1004',
    customer: 'Cloudify Labs',
    product: 'Odoo',
    plan: 'Professional Yearly',
    amount: 12000,
    date: '2026-10-27',
    validUntil: '2026-11-27',
    status: 'Expired',
  },
];

const emptyQuotation = {
  customer: '',
  product: '',
  plan: '',
  amount: '',
  date: '',
  validUntil: '',
  status: 'Draft',
};

const statuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];

function Quotations() {
  const [quotations, setQuotations] = useState(initialQuotations);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [form, setForm] = useState(emptyQuotation);

  const filteredQuotations = useMemo(() => {
    return quotations.filter((item) => {
      const matchesSearch =
        `${item.id} ${item.customer} ${item.product} ${item.plan}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter = filter === 'All' || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [quotations, search, filter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyQuotation);
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
    setForm(emptyQuotation);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.customer.trim() ||
      !form.product ||
      !form.plan.trim() ||
      form.amount === '' ||
      Number(form.amount) < 0 ||
      !form.date ||
      !form.validUntil
    ) {
      alert('Please complete all required fields.');
      return;
    }

    if (form.validUntil < form.date) {
      alert('Validity date cannot be earlier than quotation date.');
      return;
    }

    const quotationData = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId) {
      setQuotations((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...quotationData, id: editingId }
            : item
        )
      );
    } else {
      const newId = `QUO-${Date.now().toString().slice(-6)}`;
      setQuotations((previous) => [
        ...previous,
        { ...quotationData, id: newId },
      ]);
    }

    closeModal();
  };

  const updateStatus = (id, status) => {
    setQuotations((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const deleteQuotation = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      setQuotations((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  };

  const convertToSubscription = (item) => {
    if (item.status !== 'Accepted') {
      alert('Only accepted quotations can be converted into subscriptions.');
      return;
    }

    if (window.confirm(`Convert ${item.id} into a confirmed subscription?`)) {
      alert('Quotation is ready for subscription conversion. Backend integration will handle the actual conversion.');
    }
  };

  const totalValue = quotations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const acceptedCount = quotations.filter(
    (item) => item.status === 'Accepted'
  ).length;

  const pendingCount = quotations.filter(
    (item) => item.status === 'Draft' || item.status === 'Sent'
  ).length;

  return (
    <div className="quotations-page">
      <div className="quotations-heading">
        <div>
          <h2>Quotations</h2>
          <p>Create and manage customer quotations.</p>
        </div>

        <button className="quo-primary-btn" onClick={openAddModal}>
          + Create Quotation
        </button>
      </div>

      <div className="quo-stats-grid">
        <div className="quo-stat-card">
          <span>Total Quotations</span>
          <h3>{quotations.length}</h3>
        </div>

        <div className="quo-stat-card">
          <span>Total Quotation Value</span>
          <h3>₹{totalValue.toLocaleString('en-IN')}</h3>
        </div>

        <div className="quo-stat-card">
          <span>Accepted</span>
          <h3>{acceptedCount}</h3>
        </div>

        <div className="quo-stat-card">
          <span>Pending</span>
          <h3>{pendingCount}</h3>
        </div>
      </div>

      <div className="quo-toolbar">
        <input
          type="text"
          placeholder="Search quotation or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="quo-table-container">
        <table className="quo-table">
          <thead>
            <tr>
              <th>Quotation ID</th>
              <th>Customer</th>
              <th>Product / Plan</th>
              <th>Amount</th>
              <th>Quotation Date</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((item) => (
                <tr key={item.id}>
                  <td className="quo-id">{item.id}</td>
                  <td className="quo-customer">{item.customer}</td>
                  <td>
                    <strong>{item.product}</strong>
                    <span className="quo-plan">{item.plan}</span>
                  </td>
                  <td>₹{item.amount.toLocaleString('en-IN')}</td>
                  <td>{item.date}</td>
                  <td>{item.validUntil}</td>
                  <td>
                    <span className={`quo-status quo-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="quo-actions">
                      <button onClick={() => setSelectedQuotation(item)}>
                        View
                      </button>
                      <button onClick={() => openEditModal(item)}>
                        Edit
                      </button>
                      <button
                        className="quo-delete-btn"
                        onClick={() => deleteQuotation(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="quo-empty">
                  No quotations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="quo-modal-overlay" onClick={closeModal}>
          <div className="quo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quo-modal-heading">
              <div>
                <h3>{editingId ? 'Edit Quotation' : 'Create Quotation'}</h3>
                <p>Enter the quotation details below.</p>
              </div>
              <button type="button" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="quo-form-grid">
                <div className="quo-form-group">
                  <label>Customer Name *</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="quo-form-group">
                  <label>Product *</label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select product</option>
                    <option>Odoo</option>
                    <option>Technical Support</option>
                    <option>Cloud Services</option>
                    <option>Website Development</option>
                  </select>
                </div>

                <div className="quo-form-group">
                  <label>Plan *</label>
                  <input
                    name="plan"
                    value={form.plan}
                    onChange={handleChange}
                    placeholder="Enter plan name"
                    required
                  />
                </div>

                <div className="quo-form-group">
                  <label>Quotation Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="quo-form-group">
                  <label>Quotation Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="quo-form-group">
                  <label>Valid Until *</label>
                  <input
                    type="date"
                    name="validUntil"
                    min={form.date || undefined}
                    value={form.validUntil}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="quo-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="quo-modal-footer">
                <button type="button" className="quo-cancel-btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="quo-primary-btn">
                  {editingId ? 'Save Changes' : 'Create Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedQuotation && (
        <div
          className="quo-modal-overlay"
          onClick={() => setSelectedQuotation(null)}
        >
          <div className="quo-modal quo-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quo-modal-heading">
              <div>
                <h3>Quotation Details</h3>
                <p>{selectedQuotation.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedQuotation(null)}>×</button>
            </div>

            <div className="quo-details-list">
              <p><strong>Customer:</strong> {selectedQuotation.customer}</p>
              <p><strong>Product:</strong> {selectedQuotation.product}</p>
              <p><strong>Plan:</strong> {selectedQuotation.plan}</p>
              <p><strong>Amount:</strong> ₹{selectedQuotation.amount.toLocaleString('en-IN')}</p>
              <p><strong>Quotation Date:</strong> {selectedQuotation.date}</p>
              <p><strong>Valid Until:</strong> {selectedQuotation.validUntil}</p>
              <p><strong>Status:</strong> {selectedQuotation.status}</p>
            </div>

            <div className="quo-modal-footer">
              <button
                className="quo-cancel-btn"
                onClick={() => setSelectedQuotation(null)}
              >
                Close
              </button>

              <button
                className="quo-primary-btn"
                onClick={() => convertToSubscription(selectedQuotation)}
              >
                Convert to Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quotations;
