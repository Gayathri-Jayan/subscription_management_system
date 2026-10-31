
import { useMemo, useState } from 'react';
import './Payments.css';

const initialPayments = [
  {
    id: 'PAY-1001',
    invoice: 'INV-1001',
    customer: 'Acme Technologies',
    amount: 14160,
    method: 'UPI',
    date: '2026-10-15',
    transactionId: 'TXN882341',
    status: 'Completed',
  },
  {
    id: 'PAY-1002',
    invoice: 'INV-1002',
    customer: 'Pixel Studios',
    amount: 7080,
    method: 'Credit Card',
    date: '2026-10-20',
    transactionId: 'TXN882342',
    status: 'Pending',
  },
  {
    id: 'PAY-1003',
    invoice: 'INV-1003',
    customer: 'Nova Solutions',
    amount: 2950,
    method: 'Bank Transfer',
    date: '2026-10-21',
    transactionId: 'TXN882343',
    status: 'Failed',
  },
  {
    id: 'PAY-1004',
    invoice: 'INV-1004',
    customer: 'Cloudify Labs',
    amount: 14160,
    method: 'Debit Card',
    date: '2026-10-25',
    transactionId: 'TXN882344',
    status: 'Completed',
  },
];

const emptyPayment = {
  invoice: '',
  customer: '',
  amount: '',
  method: 'UPI',
  date: '',
  transactionId: '',
  status: 'Pending',
};

const statuses = ['Pending', 'Completed', 'Failed', 'Refunded'];
const methods = ['UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'];

function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [form, setForm] = useState(emptyPayment);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        `${payment.id} ${payment.invoice} ${payment.customer} ${payment.transactionId}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' || payment.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [payments, search, filter]);

  const completedAmount = payments
    .filter((payment) => payment.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const completedCount = payments.filter(
    (payment) => payment.status === 'Completed'
  ).length;

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyPayment);
    setShowModal(true);
  };

  const openEditModal = (payment) => {
    setEditingId(payment.id);
    setForm({ ...payment });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyPayment);
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
      !form.invoice.trim() ||
      !form.customer.trim() ||
      form.amount === '' ||
      Number(form.amount) <= 0 ||
      !form.date ||
      !form.transactionId.trim()
    ) {
      alert('Please complete all required fields correctly.');
      return;
    }

    const paymentData = {
      ...form,
      amount: Number(form.amount),
    };

    if (editingId) {
      setPayments((previous) =>
        previous.map((payment) =>
          payment.id === editingId
            ? { ...paymentData, id: editingId }
            : payment
        )
      );
    } else {
      const newId = `PAY-${Date.now().toString().slice(-6)}`;

      setPayments((previous) => [
        ...previous,
        { ...paymentData, id: newId },
      ]);
    }

    closeModal();
  };

  const updateStatus = (id, status) => {
    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );
  };

  const deletePayment = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments((previous) =>
        previous.filter((payment) => payment.id !== id)
      );
    }
  };

  const formatAmount = (amount) =>
    `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="payments-page">
      <div className="payments-heading">
        <div>
          <h2>Payments</h2>
          <p>Track customer transactions and payment records.</p>
        </div>

        <button className="pay-primary-btn" onClick={openAddModal}>
          + Record Payment
        </button>
      </div>

      <div className="pay-stats-grid">
        <div className="pay-stat-card">
          <span>Total Transactions</span>
          <h3>{payments.length}</h3>
        </div>

        <div className="pay-stat-card">
          <span>Completed Payments</span>
          <h3>{formatAmount(completedAmount)}</h3>
        </div>

        <div className="pay-stat-card">
          <span>Pending Amount</span>
          <h3>{formatAmount(pendingAmount)}</h3>
        </div>

        <div className="pay-stat-card">
          <span>Successful Transactions</span>
          <h3>{completedCount}</h3>
        </div>
      </div>

      <div className="pay-toolbar">
        <input
          type="text"
          placeholder="Search payment, invoice or customer..."
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

      <div className="pay-table-container">
        <table className="pay-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Customer</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td className="pay-id">{payment.id}</td>
                  <td className="pay-customer">{payment.customer}</td>
                  <td>{payment.invoice}</td>
                  <td className="pay-amount">{formatAmount(payment.amount)}</td>
                  <td>{payment.method}</td>
                  <td>{payment.date}</td>
                  <td>
                    <span className={`pay-status pay-${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <div className="pay-actions">
                      <button onClick={() => setSelectedPayment(payment)}>
                        View
                      </button>
                      <button onClick={() => openEditModal(payment)}>
                        Edit
                      </button>
                      <button
                        className="pay-delete-btn"
                        onClick={() => deletePayment(payment.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="pay-empty">
                  No payment records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="pay-modal-overlay" onClick={closeModal}>
          <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-heading">
              <div>
                <h3>{editingId ? 'Edit Payment' : 'Record New Payment'}</h3>
                <p>Enter the transaction details below.</p>
              </div>

              <button type="button" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="pay-form-grid">
                <div className="pay-form-group">
                  <label>Invoice ID *</label>
                  <input
                    name="invoice"
                    value={form.invoice}
                    onChange={handleChange}
                    placeholder="e.g. INV-1001"
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Customer Name *</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Payment Amount (₹) *</label>
                  <input
                    type="number"
                    name="amount"
                    min="0.01"
                    step="0.01"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Payment Method *</label>
                  <select
                    name="method"
                    value={form.method}
                    onChange={handleChange}
                  >
                    {methods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div className="pay-form-group">
                  <label>Payment Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Transaction ID *</label>
                  <input
                    name="transactionId"
                    value={form.transactionId}
                    onChange={handleChange}
                    placeholder="Enter transaction reference"
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Payment Status</label>
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

              <div className="pay-modal-footer">
                <button
                  type="button"
                  className="pay-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button type="submit" className="pay-primary-btn">
                  {editingId ? 'Save Changes' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPayment && (
        <div
          className="pay-modal-overlay"
          onClick={() => setSelectedPayment(null)}
        >
          <div className="pay-modal pay-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pay-modal-heading">
              <div>
                <h3>Payment Details</h3>
                <p>{selectedPayment.id}</p>
              </div>

              <button type="button" onClick={() => setSelectedPayment(null)}>×</button>
            </div>

            <div className="pay-details-list">
              <p><strong>Customer:</strong> {selectedPayment.customer}</p>
              <p><strong>Invoice:</strong> {selectedPayment.invoice}</p>
              <p><strong>Amount:</strong> {formatAmount(selectedPayment.amount)}</p>
              <p><strong>Method:</strong> {selectedPayment.method}</p>
              <p><strong>Payment Date:</strong> {selectedPayment.date}</p>
              <p><strong>Transaction ID:</strong> {selectedPayment.transactionId}</p>
              <p><strong>Status:</strong> {selectedPayment.status}</p>
            </div>

            <div className="pay-modal-footer">
              <button
                className="pay-cancel-btn"
                onClick={() => setSelectedPayment(null)}
              >
                Close
              </button>

              <select
                value={selectedPayment.status}
                onChange={(e) => {
                  updateStatus(selectedPayment.id, e.target.value);
                  setSelectedPayment({
                    ...selectedPayment,
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

export default Payments;
