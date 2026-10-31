
import { useMemo, useState } from 'react'
import './Products.css'

const initialProducts = [
  {
    id: 1,
    name: 'Business Management Suite',
    type: 'Software',
    salesPrice: 12000,
    costPrice: 7500,
    notes: 'Complete business management solution',
    variants: [{ name: 'Odoo', extraPrice: 560 }],
  },
  {
    id: 2,
    name: 'Cloud Storage Pro',
    type: 'Service',
    salesPrice: 6000,
    costPrice: 3200,
    notes: 'Premium cloud storage subscription',
    variants: [],
  },
  {
    id: 3,
    name: 'Analytics Dashboard',
    type: 'Software',
    salesPrice: 8500,
    costPrice: 5000,
    notes: 'Business analytics and reporting',
    variants: [{ name: 'Enterprise', extraPrice: 1500 }],
  },
  {
    id: 4,
    name: 'Technical Support',
    type: 'Service',
    salesPrice: 2500,
    costPrice: 1200,
    notes: 'Dedicated technical support',
    variants: [],
  },
]

const emptyForm = {
  name: '',
  type: 'Software',
  salesPrice: '',
  costPrice: '',
  notes: '',
  variants: [],
}

const currency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [variantName, setVariantName] = useState('')
  const [variantPrice, setVariantPrice] = useState('')
  const [error, setError] = useState('')

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.type}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [products, search],
  )

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingId(product.id)
    setForm({
      ...product,
      salesPrice: String(product.salesPrice),
      costPrice: String(product.costPrice),
      variants: product.variants.map((variant) => ({ ...variant })),
    })
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    setVariantName('')
    setVariantPrice('')
    setError('')
  }

  const addVariant = () => {
    if (!variantName.trim() || variantPrice === '' || Number(variantPrice) < 0) {
      setError('Enter a variant name and a valid additional price.')
      return
    }

    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        { name: variantName.trim(), extraPrice: Number(variantPrice) },
      ],
    }))

    setVariantName('')
    setVariantPrice('')
    setError('')
  }

  const removeVariant = (index) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index),
    }))
  }

  const saveProduct = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Please enter a product name.')
      return
    }

    if (
      form.salesPrice === '' ||
      form.costPrice === '' ||
      !Number.isFinite(Number(form.salesPrice)) ||
      !Number.isFinite(Number(form.costPrice)) ||
      Number(form.salesPrice) < 0 ||
      Number(form.costPrice) < 0
    ) {
      setError('Enter valid, non-negative sales and cost prices.')
      return
    }

    const productData = {
      ...form,
      name: form.name.trim(),
      salesPrice: Number(form.salesPrice),
      costPrice: Number(form.costPrice),
      id: editingId ?? Date.now(),
    }

    if (editingId !== null) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId ? productData : product,
        ),
      )
    } else {
      setProducts((current) => [productData, ...current])
    }

    closeModal()
  }

  const deleteProduct = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (confirmed) {
      setProducts((current) => current.filter((product) => product.id !== id))
    }
  }

  const totalValue = products.reduce(
    (total, product) => total + product.salesPrice,
    0,
  )

  return (
    <div className="products-page">
      <div className="products-heading">
        <div>
          <p className="products-eyebrow">PRODUCT CATALOGUE</p>
          <h1>Products</h1>
          <p>Manage your products, pricing and product variants.</p>
        </div>

        <button className="product-primary-button" onClick={openAddModal}>
          + Add Product
        </button>
      </div>

      <div className="product-stats">
        <div className="product-stat-card">
          <span>Total Products</span>
          <strong>{products.length}</strong>
          <small>Products in catalogue</small>
        </div>

        <div className="product-stat-card">
          <span>Software Products</span>
          <strong>{products.filter((p) => p.type === 'Software').length}</strong>
          <small>Software category</small>
        </div>

        <div className="product-stat-card">
          <span>Service Products</span>
          <strong>{products.filter((p) => p.type === 'Service').length}</strong>
          <small>Service category</small>
        </div>

        <div className="product-stat-card">
          <span>Combined Sales Prices</span>
          <strong>{currency(totalValue)}</strong>
          <small>Sum of listed base prices</small>
        </div>
      </div>

      <section className="products-table-panel">
        <div className="products-table-heading">
          <div>
            <h3>All Products</h3>
            <p>View and manage your product catalogue.</p>
          </div>
          <span className="product-count">{filteredProducts.length} products</span>
        </div>

        <div className="products-toolbar">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>TYPE</th>
                <th>SALES PRICE</th>
                <th>COST PRICE</th>
                <th>VARIANTS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <strong className="product-name">{product.name}</strong>
                    <small className="product-notes">
                      {product.notes || 'No additional notes'}
                    </small>
                  </td>
                  <td>
                    <span className={`product-type ${product.type.toLowerCase()}`}>
                      {product.type}
                    </span>
                  </td>
                  <td className="product-price">{currency(product.salesPrice)}</td>
                  <td>{currency(product.costPrice)}</td>
                  <td>
                    <span className="variant-count">
                      {product.variants.length} variants
                    </span>
                  </td>
                  <td>
                    <div className="product-actions">
                      <button
                        className="edit-action"
                        onClick={() => openEditModal(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-action"
                        onClick={() => deleteProduct(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="products-empty">
                    No products found. Try another search or add a product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="product-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeModal()
        }}>
          <form className="product-modal" onSubmit={saveProduct}>
            <div className="product-modal-heading">
              <div>
                <h2>{editingId !== null ? 'Edit Product' : 'Add New Product'}</h2>
                <p>Enter the product information below.</p>
              </div>
              <button type="button" className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <label>
              Product Name *
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Business Management Suite"
                required
              />
            </label>

            <label>
              Product Type *
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Software</option>
                <option>Service</option>
                <option>Physical</option>
              </select>
            </label>

            <div className="product-form-row">
              <label>
                Sales Price (₹) *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salesPrice}
                  onChange={(e) => setForm({ ...form, salesPrice: e.target.value })}
                  placeholder="12000"
                  required
                />
              </label>

              <label>
                Cost Price (₹) *
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
                  placeholder="7500"
                  required
                />
              </label>
            </div>

            <label>
              Product Notes
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Add product details..."
              />
            </label>

            <div className="variant-section">
              <h3>Product Variants</h3>
              <p>Add optional variants and their additional prices.</p>

              {form.variants.map((variant, index) => (
                <div className="variant-row" key={`${variant.name}-${index}`}>
                  <span>{variant.name}</span>
                  <strong>+{currency(variant.extraPrice)}</strong>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    aria-label={`Remove ${variant.name} variant`}
                  >
                    ×
                  </button>
                </div>
              ))}

              <div className="variant-input-row">
                <input
                  placeholder="Variant name"
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  aria-label="Variant name"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Extra price"
                  value={variantPrice}
                  onChange={(e) => setVariantPrice(e.target.value)}
                  aria-label="Variant additional price"
                />
                <button type="button" onClick={addVariant}>Add</button>
              </div>
            </div>

            {error && <p className="product-form-error">{error}</p>}

            <div className="product-modal-actions">
              <button type="button" className="cancel-product" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="product-primary-button">
                {editingId !== null ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Products
