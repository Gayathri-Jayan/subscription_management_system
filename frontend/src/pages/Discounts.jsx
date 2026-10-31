import { useState } from "react";
import "./Discounts.css";

const initialDiscounts = [
  {
    id: 1,
    name: "New Customer Offer",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    appliesTo: "All Plans",
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    usageLimit: 100,
    used: 32,
    status: "Active",
  },
  {
    id: 2,
    name: "Annual Subscription Offer",
    code: "ANNUAL20",
    type: "Percentage",
    value: 20,
    appliesTo: "Annual Plans",
    startDate: "2026-10-01",
    endDate: "2026-11-30",
    usageLimit: 50,
    used: 18,
    status: "Active",
  },
  {
    id: 3,
    name: "Festive Discount",
    code: "FESTIVE500",
    type: "Fixed Amount",
    value: 500,
    appliesTo: "Premium Plan",
    startDate: "2026-09-01",
    endDate: "2026-10-15",
    usageLimit: 200,
    used: 120,
    status: "Expired",
  },
];

const emptyForm = {
  name: "",
  code: "",
  type: "Percentage",
  value: "",
  appliesTo: "All Plans",
  startDate: "",
  endDate: "",
  usageLimit: "",
  status: "Active",
};

function Discounts() {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const activeCount = discounts.filter((d) => d.status === "Active").length;
  const expiredCount = discounts.filter((d) => d.status === "Expired").length;
  const totalUses = discounts.reduce((sum, d) => sum + d.used, 0);

  const filteredDiscounts = discounts.filter((discount) => {
    const matchesSearch =
      discount.name.toLowerCase().includes(search.toLowerCase()) ||
      discount.code.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || discount.status === filter;

    return matchesSearch && matchesFilter;
  });

  const updateForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (discount) => {
    setEditingId(discount.id);
    setForm({
      ...discount,
      value: String(discount.value),
      usageLimit: String(discount.usageLimit),
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(form.value);
    const usageLimit = Number(form.usageLimit);

    if (!form.name.trim() || !form.code.trim()) {
      alert("Please enter the discount name and code.");
      return;
    }

    if (!Number.isFinite(value) || value <= 0) {
      alert("Enter a valid discount value.");
      return;
    }

    if (form.type === "Percentage" && value > 100) {
      alert("Percentage discount cannot exceed 100%.");
      return;
    }

    if (!Number.isInteger(usageLimit) || usageLimit < 0) {
      alert("Enter a valid usage limit.");
      return;
    }

    if (
      !form.startDate ||
      !form.endDate ||
      form.endDate < form.startDate
    ) {
      alert("Please enter valid availability dates.");
      return;
    }

    const discountData = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      value,
      usageLimit,
    };

    if (editingId) {
      setDiscounts(
        discounts.map((d) =>
          d.id === editingId ? { ...discountData, id: editingId } : d
        )
      );
    } else {
      setDiscounts([
        ...discounts,
        {
          ...discountData,
          id: Date.now(),
          used: 0,
        },
      ]);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const deleteDiscount = (id) => {
    if (window.confirm("Are you sure you want to delete this discount?")) {
      setDiscounts(discounts.filter((d) => d.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id
          ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" }
          : d
      )
    );
  };

  const formatValue = (discount) =>
    discount.type === "Percentage"
      ? `${discount.value}%`
      : `₹${discount.value.toLocaleString("en-IN")}`;

  return (
    <div className="discounts-page">
      <div className="discounts-header">
        <div>
          <h1>Discounts</h1>
          <p>Manage promotional offers and discount codes.</p>
        </div>

        <button className="discount-add-btn" onClick={openAddModal}>
          + Create Discount
        </button>
      </div>

      <div className="discount-stats">
        <div className="discount-stat-card">
          <span>Total Discounts</span>
          <h2>{discounts.length}</h2>
        </div>
        <div className="discount-stat-card">
          <span>Active Discounts</span>
          <h2>{activeCount}</h2>
        </div>
        <div className="discount-stat-card">
          <span>Expired Discounts</span>
          <h2>{expiredCount}</h2>
        </div>
        <div className="discount-stat-card">
          <span>Total Uses</span>
          <h2>{totalUses}</h2>
        </div>
      </div>

      <div className="discount-toolbar">
        <input
          type="text"
          placeholder="Search by discount name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      <div className="discount-table-container">
        <table className="discount-table">
          <thead>
            <tr>
              <th>Discount</th>
              <th>Code</th>
              <th>Value</th>
              <th>Applies To</th>
              <th>Validity</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredDiscounts.length > 0 ? (
              filteredDiscounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="discount-name">{discount.name}</td>
                  <td>
                    <span className="discount-code">{discount.code}</span>
                  </td>
                  <td>{formatValue(discount)}</td>
                  <td>{discount.appliesTo}</td>
                  <td>
                    <div className="discount-dates">
                      {discount.startDate}
                      <span>to {discount.endDate}</span>
                    </div>
                  </td>
                  <td>
                    {discount.used}/{discount.usageLimit || "Unlimited"}
                  </td>
                  <td>
                    <span
                      className={`discount-status ${discount.status.toLowerCase()}`}
                    >
                      {discount.status}
                    </span>
                  </td>
                  <td>
                    <div className="discount-actions">
                      <button onClick={() => openEditModal(discount)}>
                        Edit
                      </button>
                      <button onClick={() => toggleStatus(discount.id)}>
                        {discount.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="discount-delete"
                        onClick={() => deleteDiscount(discount.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="discount-empty">
                  No discounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="discount-modal-overlay">
          <div className="discount-modal">
            <div className="discount-modal-header">
              <div>
                <h2>{editingId ? "Edit Discount" : "Create Discount"}</h2>
                <p>Enter the discount details below.</p>
              </div>
              <button
                className="discount-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="discount-form-grid">
                <label>
                  Discount Name *
                  <input
                    name="name"
                    value={form.name}
                    onChange={updateForm}
                    placeholder="e.g. New Customer Offer"
                    required
                  />
                </label>

                <label>
                  Discount Code *
                  <input
                    name="code"
                    value={form.code}
                    onChange={updateForm}
                    placeholder="e.g. WELCOME10"
                    required
                  />
                </label>

                <label>
                  Discount Type
                  <select name="type" value={form.type} onChange={updateForm}>
                    <option>Percentage</option>
                    <option>Fixed Amount</option>
                  </select>
                </label>

                <label>
                  Discount Value *
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={updateForm}
                    min="0.01"
                    step="0.01"
                    placeholder={form.type === "Percentage" ? "10" : "500"}
                    required
                  />
                </label>

                <label>
                  Applies To
                  <select
                    name="appliesTo"
                    value={form.appliesTo}
                    onChange={updateForm}
                  >
                    <option>All Plans</option>
                    <option>Monthly Plans</option>
                    <option>Annual Plans</option>
                    <option>Premium Plan</option>
                    <option>Selected Products</option>
                  </select>
                </label>

                <label>
                  Usage Limit
                  <input
                    type="number"
                    name="usageLimit"
                    value={form.usageLimit}
                    onChange={updateForm}
                    min="0"
                    placeholder="0 = Unlimited"
                  />
                </label>

                <label>
                  Start Date *
                  <input
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  End Date *
                  <input
                    type="date"
                    name="endDate"
                    value={form.endDate}
                    onChange={updateForm}
                    min={form.startDate || undefined}
                    required
                  />
                </label>

                <label>
                  Status
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateForm}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Expired</option>
                  </select>
                </label>
              </div>

              <div className="discount-modal-actions">
                <button
                  type="button"
                  className="discount-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="discount-save-btn">
                  {editingId ? "Save Changes" : "Create Discount"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discounts;