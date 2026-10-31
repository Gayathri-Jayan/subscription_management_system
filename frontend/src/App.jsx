
import { useState } from 'react';
import './App.css';

import Auth from './components/Auth';
import Products from './pages/Products';
import Plans from './pages/Plans';
import Subscriptions from './pages/Subscriptions';
import Quotations from './pages/Quotations';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Discounts from './pages/Discounts';
import Reports from './pages/Reports';

const subscriptions = [
  { id: 'SUB-1001', customer: 'Acme Technologies', plan: 'Enterprise', amount: '₹12,000', status: 'Active', date: '31 Oct 2026' },
  { id: 'SUB-1002', customer: 'Pixel Studios', plan: 'Professional', amount: '₹6,000', status: 'Active', date: '30 Oct 2026' },
  { id: 'SUB-1003', customer: 'Nova Solutions', plan: 'Basic', amount: '₹2,500', status: 'Pending', date: '29 Oct 2026' },
  { id: 'SUB-1004', customer: 'Cloudify Labs', plan: 'Enterprise', amount: '₹12,000', status: 'Active', date: '28 Oct 2026' },
  { id: 'SUB-1005', customer: 'Bright Digital', plan: 'Professional', amount: '₹6,000', status: 'Cancelled', date: '27 Oct 2026' },
];

const menuItems = [
  { name: 'Overview', icon: '◫' },
  { name: 'Products', icon: '▦' },
  { name: 'Plans', icon: '▤' },
  { name: 'Subscriptions', icon: '⟳' },
  { name: 'Quotations', icon: '▧' },
  { name: 'Invoices', icon: '▣' },
  { name: 'Payments', icon: '⇄' },
  { name: 'Discounts', icon: '%' },
  { name: 'Reports', icon: '▥' },
];

const pageComponents = {
  Products,
  Plans,
  Subscriptions,
  Quotations,
  Invoices,
  Payments,
  Discounts,
  Reports,
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      return token && savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return null;
    }
  });

  const [activePage, setActivePage] = useState('Overview');
  const [search, setSearch] = useState('');

  const filteredSubscriptions = subscriptions.filter((item) =>
    `${item.customer} ${item.id} ${item.plan}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const PageComponent = pageComponents[activePage];

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setActivePage('Overview');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
    setActivePage('Overview');
  };

  // Show login screen when the user is not authenticated.
  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">B</div>
          <div>
            <h2>brightloop</h2>
            <span>SOFTWARE</span>
          </div>
        </div>

        <div className="workspace">
          <span className="workspace-dot"></span>
          Brightloop Workspace
          <span className="workspace-arrow">⌄</span>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? 'active' : ''}`}
              onClick={() => setActivePage(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}

              {item.name === 'Invoices' && (
                <span className="nav-count">4</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <p className="menu-label">PREFERENCES</p>

          <button className="nav-item">
            <span className="nav-icon">⚙</span> Settings
          </button>

          <div className="user-profile">
            <div className="avatar">
              {(user.name || 'U').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
            <button
              className="profile-more"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              ↪
            </button>
          </div>

          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-icon">⇥</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP NAVIGATION */}
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>

          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              ♧
            </button>
            <button className="help-button">Help & Support</button>
            <div className="top-avatar">
              {(user.name || 'U').substring(0, 2).toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        {activePage !== 'Overview' && PageComponent ? (

          <section className="page-content">
            <PageComponent />
          </section>

        ) : (

          <section className="page-content">

            {/* DASHBOARD HEADING */}
            <div className="page-heading">
              <div>
                <p className="eyebrow">SATURDAY, OCTOBER 31, 2026</p>

                <h1>Good morning, {user.name} 👋</h1>

                <p className="subtitle">
                  Here's what's happening with your subscriptions today.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setActivePage('Subscriptions')}
              >
                + New Subscription
              </button>
            </div>

            {/* STATISTICS */}
            <div className="stats-grid">
              <StatCard
                title="Total Revenue"
                value="₹8,42,500"
                change="+12.8%"
                icon="₹"
              />

              <StatCard
                title="Active Subscriptions"
                value="1,284"
                change="+8.2%"
                icon="↗"
              />

              <StatCard
                title="Total Customers"
                value="856"
                change="+5.4%"
                icon="♙"
              />

              <StatCard
                title="Overdue Invoices"
                value="24"
                change="Needs attention"
                icon="!"
                warning
              />
            </div>

            {/* CHARTS */}
            <div className="content-grid">

              <section className="panel revenue-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Revenue Overview</h3>
                    <p>Monitor your recurring revenue performance</p>
                  </div>

                  <select
                    aria-label="Revenue period"
                    className="period-select"
                  >
                    <option>Last 7 months</option>
                    <option>Last 30 days</option>
                    <option>This year</option>
                  </select>
                </div>

                <div className="revenue-summary">
                  <strong>₹8,42,500</strong>
                  <span>↑ 12.8% <small>vs last month</small></span>
                </div>

                <div className="chart">
                  {[42, 57, 48, 72, 62, 85, 76, 95, 68, 88, 78, 100].map(
                    (height, i) => (
                      <div className="chart-column" key={i}>
                        <div
                          className="chart-bar"
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                    )
                  )}
                </div>

                <div className="chart-labels">
                  {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </section>

              <section className="panel plan-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Subscription Summary</h3>
                    <p>Current subscription status</p>
                  </div>
                  <span className="more-button">···</span>
                </div>

                <div className="donut-wrapper">
                  <div className="donut">
                    <div className="donut-center">
                      <strong>1,284</strong>
                      <span>Total</span>
                    </div>
                  </div>
                </div>

                <div className="legend">
                  <div>
                    <span className="legend-dot active-dot"></span>
                    Active <strong>856</strong>
                  </div>

                  <div>
                    <span className="legend-dot pending-dot"></span>
                    Pending <strong>248</strong>
                  </div>

                  <div>
                    <span className="legend-dot cancelled-dot"></span>
                    Cancelled <strong>180</strong>
                  </div>
                </div>
              </section>

            </div>

            {/* RECENT SUBSCRIPTIONS */}
            <section className="panel subscriptions-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent Subscriptions</h3>
                  <p>Keep track of your latest customer subscriptions</p>
                </div>

                <button
                  className="view-all"
                  onClick={() => setActivePage('Subscriptions')}
                >
                  View all →
                </button>
              </div>

              <div className="table-toolbar">
                <input
                  className="search-input"
                  placeholder="⌕ Search customers or subscription ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="filter-button">
                  ⚷ Filters
                </button>
              </div>

              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>SUBSCRIPTION ID</th>
                      <th>CUSTOMER</th>
                      <th>PLAN</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>START DATE</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSubscriptions.map((item) => (
                      <tr key={item.id}>
                        <td className="subscription-id">{item.id}</td>
                        <td className="customer-name">{item.customer}</td>
                        <td>{item.plan}</td>
                        <td className="amount">{item.amount}</td>
                        <td>
                          <span className={`status ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.date}</td>
                      </tr>
                    ))}

                    {filteredSubscriptions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="empty-state">
                          No subscriptions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
              © 2026 Brightloop Software. All rights reserved.
              <span>Subscription Management Platform</span>
            </footer>

          </section>
        )}

      </main>
    </div>
  );
}

function StatCard({ title, value, change, icon, warning }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${warning ? 'warning-icon' : ''}`}>
        {icon}
      </div>

      <p>{title}</p>
      <h2>{value}</h2>

      <span className={warning ? 'warning-text' : 'growth-text'}>
        {warning ? '● ' : '↗ '}
        {change}
      </span>
    </div>
  );
}

export default App;
