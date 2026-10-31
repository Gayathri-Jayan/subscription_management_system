
import { useMemo, useState } from 'react';
import './Plans.css';

const initialPlans = [
  {
    id: 1,
    name: 'Basic Monthly',
    product: 'Odoo',
    price: 999,
    interval: 'Monthly',
    minQuantity: 1,
    startDate: '2026-01-01',
    endDate: '',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Professional Yearly',
    product: 'Odoo',
    price: 9999,
    interval: 'Yearly',
    minQuantity: 1,
    startDate: '2026-01-01',
    endDate: '',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Support Weekly',
    product: 'Technical Support',
    price: 499,
    interval: 'Weekly',
    minQuantity: 1,
    startDate: '2026-02-01',
    endDate: '',
    status: 'Active',
  },
];

const emptyPlan = {
  name: '',
  product: '',
  price: '',
  interval: 'Monthly',
  minQuantity: 1,
  startDate: '',
  endDate: '',
  status: 'Active',
};

function Plans() {
  const [plans, setPlans] = useState(initialPlans);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPlan);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        plan.name.toLowerCase().includes(search.toLowerCase()) ||
        plan.product.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' || plan.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [plans, search, filter]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyPlan);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingId(plan.id);
    setForm({ ...plan });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyPlan);
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
      !form.name.trim() ||
      !form.product ||
      form.price === '' ||
      Number(form.price) < 0 ||
      Number(form.minQuantity) < 1 ||
      !form.startDate
    ) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    if (form.endDate && form.endDate < form.startDate) {
      alert('End date cannot be earlier than the start date.');
      return;
    }

    const planData = {
      ...form,
      price: Number(form.price),
      minQuantity: Number(form.minQuantity),
    };

    if (editingId !== null) {
      setPlans((previous) =>
        previous.map((plan) =>
          plan.id === editingId
            ? { ...planData, id: editingId }
            : plan
        )
      );
    } else {
      setPlans((previous) => [
        ...previous,
        { ...planData, id: Date.now() },
      ]);
    }

    closeModal();
  };

  const toggleStatus = (id) => {
    setPlans((previous) =>
      previous.map((plan) =>
        plan.id === id
          ? {
              ...plan,
              status: plan.status === 'Active' ? 'Archived' : 'Active',
            }
          : plan
      )
    );
  };

  const deletePlan = (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans((previous) =>
        previous.filter((plan) => plan.id !== id)
      );
    }
  };

  const activeCount = plans.filter(
    (plan) => plan.status === 'Active'
  ).length;

  const archivedCount = plans.filter(
    (plan) => plan.status === 'Archived'
  ).length;

  return (
    <div className="plans-page">
      <div className="plans-heading">
        <div>
          <h2>Subscription Plans</h2>
          <p>Create and manage your subscription pricing plans.</p>
        </div>

        <button className="plan-primary-btn" onClick={openAddModal}>
          + Create Plan
        </button>
      </div>

      <div className="plan-stats">
        <div className="plan-stat-card">
          <span>Total Plans</span>
          <h3>{plans.length}</h3>
        </div>

        <div className="plan-stat-card">
          <span>Active Plans</span>
          <h3>{activeCount}</h3>
        </div>

        <div className="plan-stat-card">
          <span>Archived Plans</span>
          <h3>{archivedCount}</h3>
        </div>
      </div>

      <div className="plans-toolbar">
        <input
          type="text"
          placeholder="Search plans or products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Plans</option>
          <option value="Active">Active</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      <div className="plans-table-container">
        <table className="plans-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Product</th>
              <th>Price</th>
              <th>Billing Interval</th>
              <th>Min. Qty</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPlans.length > 0 ? (
              filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="plan-name-cell">{plan.name}</td>
                  <td>{plan.product}</td>
                  <td>₹{plan.price.toLocaleString('en-IN')}</td>
                  <td>{plan.interval}</td>
                  <td>{plan.minQuantity}</td>
                  <td>
                    {plan.startDate}
                    <br />
                    <span className="plan-date">
                      {plan.endDate || 'No end date'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`plan-status ${
                        plan.status === 'Active'
                          ? 'status-active'
                          : 'status-archived'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td>
                    <div className="plan-actions">
                      <button
                        className="plan-edit-btn"
                        onClick={() => openEditModal(plan)}
                      >
                        Edit
                      </button>

                      <button
                        className="plan-archive-btn"
                        onClick={() => toggleStatus(plan.id)}
                      >
                        {plan.status === 'Active' ? 'Archive' : 'Activate'}
                      </button>

                      <button
                        className="plan-delete-btn"
                        onClick={() => deletePlan(plan.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="plans-empty">
                  No plans found. Try another search or create a new plan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="plan-modal-overlay" onClick={closeModal}>
          <div
            className="plan-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="plan-modal-header">
              <div>
                <h3>{editingId ? 'Edit Plan' : 'Create New Plan'}</h3>
                <p>Enter the subscription plan details below.</p>
              </div>

              <button
                className="plan-close-btn"
                onClick={closeModal}
                type="button"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="plan-form-grid">
                <div className="plan-form-group">
                  <label>Plan Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Premium Monthly"
                    required
                  />
                </div>

                <div className="plan-form-group">
                  <label>Product *</label>
                  <select
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select product</option>
                    <option value="Odoo">Odoo</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Cloud Services">Cloud Services</option>
                    <option value="Website Development">Website Development</option>
                  </select>
                </div>

                <div className="plan-form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div className="plan-form-group">
                  <label>Billing Interval *</label>
                  <select
                    name="interval"
                    value={form.interval}
                    onChange={handleChange}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div className="plan-form-group">
                  <label>Minimum Quantity *</label>
                  <input
                    type="number"
                    name="minQuantity"
                    min="1"
                    value={form.minQuantity}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="plan-form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="plan-form-group">
                  <label>Available From *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="plan-form-group">
                  <label>Available Until</label>
                  <input
                    type="date"
                    name="endDate"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="plan-modal-footer">
                <button
                  type="button"
                  className="plan-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="plan-primary-btn">
                  {editingId ? 'Save Changes' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Plans;
