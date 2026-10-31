
import { useMemo, useState } from 'react';
import './Invoices.css';

const initialInvoices = [
  {
    id: 'INV-1001',
    customer: 'Acme Technologies',
    subscription: 'SUB-1001',
    amount: 12000,
    tax: 2160,
    issueDate: '2026-10-01',
    dueDate: '2026-10-15',
    status: 'Paid',
  },
  {
    id: 'INV-1002',
    customer: 'Pixel Studios',
    subscription: 'SUB-1002',
    amount: 6000,
    tax: 1080,
    issueDate: '2026-10-05',
    dueDate: '2026-10-20',
    status: 'Pending',
  },
  {
    id: 'INV-1003',
    customer: 'Nova Solutions',
    subscription: 'SUB-1003',
    amount: 2500,
    tax: 450,
    issueDate: '2026-10-10',
    dueDate: '2026-10-20',
    status: 'Overdue',
  },
  {
    id: 'INV-1004',
    customer: 'Cloudify Labs',
    subscription: 'SUB-1004',
    amount: 12000,
    tax: 2160,
    issueDate: '2026-10-15',
    dueDate: '2026-10-30',
    status: 'Paid',
  },
  {
    id: 'INV-1005',
    customer: 'Bright Digital',
    subscription: 'SUB-1005',
    amount: 6000,
    tax: 1080,
    issueDate: '2026-10-20',
    dueDate: '2026-11-05',
    status: 'Draft',
  },
];

const emptyInvoice = {
  customer: '',
  subscription: '',
  amount: '',
  tax: 18,
  issueDate: '',
  dueDate: '',
  status: 'Draft',
};

const statuses = ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'];

function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState(emptyInvoice);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        `${invoice.id} ${invoice.customer} ${invoice.subscription}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === 'All' || invoice.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [invoices, search, filter]);

  const totalAmount = invoices.reduce(
    (sum, invoice) => sum + invoice.amount + (invoice.amount * invoice.tax / 100),
    0
  );

  const paidAmount = invoices
    .filter((invoice) => invoice.status === 'Paid')
    .reduce(
      (sum, invoice) => sum + invoice.amount + (invoice.amount * invoice.tax / 100),
      0
    );

  const overdueCount = invoices.filter(
    (invoice) => invoice.status === 'Overdue'
  ).length;

  const pendingCount = invoices.filter(
    (invoice) => invoice.status === 'Pending'
  ).length;

  const getTotal = (invoice) =>
    invoice.amount + (invoice.amount * invoice.tax / 100);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyInvoice);
    setShowModal(true);
  };

  const openEditModal = (invoice) => {
    setEditingId(invoice.id);
    setForm({ ...invoice });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyInvoice);
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
      !form.subscription.trim() ||
      form.amount === '' ||
      Number(form.amount) < 0 ||
      form.tax === '' ||
      Number(form.tax) < 0 ||
      !form.issueDate ||
      !form.dueDate
    ) {
      alert('Please complete all required fields correctly.');
      return;
    }

    if (form.dueDate < form.issueDate) {
      alert('Due date cannot be earlier than issue date.');
      return;
    }

    const invoiceData = {
      ...form,
      amount: Number(form.amount),
      tax: Number(form.tax),
    };

    if (editingId) {
      setInvoices((previous) =>
        previous.map((invoice) =>
          invoice.id === editingId
            ? { ...invoiceData, id: editingId }
            : invoice
        )
      );
    } else {
      const newId = `INV-${Date.now().toString().slice(-6)}`;

      setInvoices((previous) => [
        ...previous,
        { ...invoiceData, id: newId },
      ]);
    }

    closeModal();
  };

  const updateStatus = (id, status) => {
    setInvoices((previous) =>
      previous.map((invoice) =>
        invoice.id === id ? { ...invoice, status } : invoice
      )
    );
  };

  const deleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices((previous) =>
        previous.filter((invoice) => invoice.id !== id)
      );
    }
  };

  const printInvoice = (invoice) => {
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow pop-ups to print the invoice.');
      return;
    }

    const total = getTotal(invoice);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #26344a; }
            h1 { color: #4169e1; }
            .details { margin-top: 30px; line-height: 2; }
            .total { margin-top: 25px; font-size: 20px; font-weight: bold; }
            hr { border: 0; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>BRIGHTLOOP SOFTWARE</h1>
          <h2>INVOICE: ${invoice.id}</h2>
          <hr />
          <div class="details">
            <p><strong>Customer:</strong> ${invoice.customer}</p>
            <p><strong>Subscription:</strong> ${invoice.subscription}</p>
            <p><strong>Issue Date:</strong> ${invoice.issueDate}</p>
            <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
            <p><strong>Subtotal:</strong> ₹${invoice.amount.toLocaleString('en-IN')}</p>
            <p><strong>Tax (${invoice.tax}%):</strong> ₹${(invoice.amount * invoice.tax / 100).toLocaleString('en-IN')}</p>
          </div>
          <hr />
          <p class="total">Total: ₹${total.toLocaleString('en-IN')}</p>
          <p>Status: ${invoice.status}</p>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="invoices-page">
      <div className="invoices-heading">
        <div>
          <h2>Invoices</h2>
          <p>Manage customer invoices, billing and payment status.</p>
        </div>

        <button className="inv-primary-btn" onClick={openAddModal}>
          + Create Invoice
        </button>
      </div>

      <div className="inv-stats-grid">
        <div className="inv-stat-card">
          <span>Total Invoice Value</span>
          <h3>₹{totalAmount.toLocaleString('en-IN')}</h3>
        </div>

        <div className="inv-stat-card">
          <span>Paid Amount</span>
          <h3>₹{paidAmount.toLocaleString('en-IN')}</h3>
        </div>

        <div className="inv-stat-card">
          <span>Pending Invoices</span>
          <h3>{pendingCount}</h3>
        </div>

        <div className="inv-stat-card">
          <span>Overdue Invoices</span>
          <h3>{overdueCount}</h3>
        </div>
      </div>

      <div className="inv-toolbar">
        <input
          type="text"
          placeholder="Search invoice or customer..."
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

      <div className="inv-table-container">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Subscription</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length > 0 ? (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="inv-id">{invoice.id}</td>
                  <td className="inv-customer">{invoice.customer}</td>
                  <td>{invoice.subscription}</td>
                  <td>₹{invoice.amount.toLocaleString('en-IN')}</td>
                  <td>{invoice.tax}%</td>
                  <td className="inv-total">
                    ₹{getTotal(invoice).toLocaleString('en-IN')}
                  </td>
                  <td>{invoice.dueDate}</td>
                  <td>
                    <span className={`inv-status inv-${invoice.status.toLowerCase()}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    <div className="inv-actions">
                      <button onClick={() => setSelectedInvoice(invoice)}>
                        View
                      </button>
                      <button onClick={() => openEditModal(invoice)}>
                        Edit
                      </button>
                      <button onClick={() => printInvoice(invoice)}>
                        Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="inv-empty">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="inv-modal-overlay" onClick={closeModal}>
          <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal-heading">
              <div>
                <h3>{editingId ? 'Edit Invoice' : 'Create Invoice'}</h3>
                <p>Enter invoice and billing details.</p>
              </div>
              <button type="button" onClick={closeModal}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="inv-form-grid">
                <div className="inv-form-group">
                  <label>Customer Name *</label>
                  <input
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="inv-form-group">
                  <label>Subscription ID *</label>
                  <input
                    name="subscription"
                    value={form.subscription}
                    onChange={handleChange}
                    placeholder="e.g. SUB-1001"
                    required
                  />
                </div>

                <div className="inv-form-group">
                  <label>Subtotal (₹) *</label>
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

                <div className="inv-form-group">
                  <label>Tax (%) *</label>
                  <input
                    type="number"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={form.tax}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inv-form-group">
                  <label>Issue Date *</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inv-form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    min={form.issueDate || undefined}
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="inv-form-group">
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

              <div className="inv-modal-footer">
                <button
                  type="button"
                  className="inv-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="inv-primary-btn">
                  {editingId ? 'Save Changes' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div
          className="inv-modal-overlay"
          onClick={() => setSelectedInvoice(null)}
        >
          <div className="inv-modal inv-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="inv-modal-heading">
              <div>
                <h3>Invoice Details</h3>
                <p>{selectedInvoice.id}</p>
              </div>
              <button type="button" onClick={() => setSelectedInvoice(null)}>×</button>
            </div>

            <div className="inv-details-list">
              <p><strong>Customer:</strong> {selectedInvoice.customer}</p>
              <p><strong>Subscription:</strong> {selectedInvoice.subscription}</p>
              <p><strong>Issue Date:</strong> {selectedInvoice.issueDate}</p>
              <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              <p><strong>Subtotal:</strong> ₹{selectedInvoice.amount.toLocaleString('en-IN')}</p>
              <p><strong>Tax:</strong> {selectedInvoice.tax}%</p>
              <p><strong>Total:</strong> ₹{getTotal(selectedInvoice).toLocaleString('en-IN')}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
            </div>

            <div className="inv-modal-footer">
              <button
                className="inv-cancel-btn"
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>

              <select
                value={selectedInvoice.status}
                onChange={(e) => {
                  updateStatus(selectedInvoice.id, e.target.value);
                  setSelectedInvoice({
                    ...selectedInvoice,
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

export default Invoices;
