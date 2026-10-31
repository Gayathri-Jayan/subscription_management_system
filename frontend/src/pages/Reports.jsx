import { useState } from "react";
import "./Reports.css";

const reportData = {
  "Last 7 Days": {
    revenue: 42500,
    subscriptions: 18,
    invoices: 24,
    overdue: 3,
    chart: [35, 55, 42, 75, 60, 85, 100],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  "Last 30 Days": {
    revenue: 185000,
    subscriptions: 64,
    invoices: 92,
    overdue: 8,
    chart: [30, 45, 38, 65, 52, 80, 70, 95, 85, 100],
    labels: ["1", "4", "7", "10", "13", "16", "19", "22", "25", "30"],
  },
  "Last 12 Months": {
    revenue: 1250000,
    subscriptions: 420,
    invoices: 680,
    overdue: 21,
    chart: [35, 42, 50, 45, 60, 55, 72, 68, 80, 75, 90, 100],
    labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
};

const topPlans = [
  { name: "Basic Monthly", customers: 145, revenue: 72500, percentage: 85 },
  { name: "Premium Annual", customers: 98, revenue: 98000, percentage: 70 },
  { name: "Standard Monthly", customers: 76, revenue: 57000, percentage: 55 },
  { name: "Enterprise Annual", customers: 32, revenue: 96000, percentage: 35 },
];

const recentActivity = [
  { customer: "Rahul Menon", event: "New subscription", plan: "Premium Annual", date: "31 Oct 2026", status: "Active" },
  { customer: "Anjali Nair", event: "Payment received", plan: "Basic Monthly", date: "30 Oct 2026", status: "Completed" },
  { customer: "Arjun Das", event: "Invoice overdue", plan: "Standard Monthly", date: "29 Oct 2026", status: "Overdue" },
  { customer: "Meera Joseph", event: "Subscription renewed", plan: "Enterprise Annual", date: "28 Oct 2026", status: "Active" },
];

function Reports() {
  const [period, setPeriod] = useState("Last 30 Days");
  const data = reportData[period];

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const exportCSV = () => {
    const rows = [
      ["Metric", "Value"],
      ["Revenue", data.revenue],
      ["Subscriptions", data.subscriptions],
      ["Invoices", data.invoices],
      ["Overdue Invoices", data.overdue],
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "brightloop-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Track business performance and subscription insights.</p>
        </div>

        <div className="reports-header-actions">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 12 Months</option>
          </select>

          <button onClick={exportCSV}>↓ Export Report</button>
        </div>
      </div>

      <div className="reports-stats">
        <div className="report-stat-card">
          <div className="report-stat-top">
            <span>Total Revenue</span>
            <span className="report-icon revenue-icon">₹</span>
          </div>
          <h2>{formatCurrency(data.revenue)}</h2>
          <p className="report-positive">Revenue for selected period</p>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-top">
            <span>New Subscriptions</span>
            <span className="report-icon subscription-icon">↗</span>
          </div>
          <h2>{data.subscriptions}</h2>
          <p className="report-positive">Subscriptions created</p>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-top">
            <span>Invoices Generated</span>
            <span className="report-icon invoice-icon">▤</span>
          </div>
          <h2>{data.invoices}</h2>
          <p className="report-neutral">Invoices in selected period</p>
        </div>

        <div className="report-stat-card">
          <div className="report-stat-top">
            <span>Overdue Invoices</span>
            <span className="report-icon overdue-icon">!</span>
          </div>
          <h2>{data.overdue}</h2>
          <p className="report-warning">Require follow-up</p>
        </div>
      </div>

      <div className="reports-main-grid">
        <div className="report-panel revenue-panel">
          <div className="report-panel-header">
            <div>
              <h3>Revenue Overview</h3>
              <p>Revenue performance for {period.toLowerCase()}</p>
            </div>
            <span className="report-panel-tag">INR (₹)</span>
          </div>

          <div className="revenue-chart">
            <div className="chart-y-labels">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="chart-content">
              <div className="chart-grid-lines">
                {[1, 2, 3, 4, 5].map((line) => (
                  <div key={line}></div>
                ))}
              </div>

              <div className="chart-bars">
                {data.chart.map((value, index) => (
                  <div className="chart-bar-group" key={index}>
                    <div
                      className="chart-bar"
                      style={{ height: `${value}%` }}
                      title={`${value}%`}
                    ></div>
                    <span>{data.labels[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="report-panel">
          <div className="report-panel-header">
            <div>
              <h3>Subscription Summary</h3>
              <p>Current subscription distribution</p>
            </div>
          </div>

          <div className="subscription-summary">
            <div className="summary-item">
              <span className="summary-dot active-dot"></span>
              <span>Active</span>
              <strong>245</strong>
            </div>
            <div className="summary-item">
              <span className="summary-dot draft-dot"></span>
              <span>Draft</span>
              <strong>28</strong>
            </div>
            <div className="summary-item">
              <span className="summary-dot closed-dot"></span>
              <span>Closed</span>
              <strong>17</strong>
            </div>
            <div className="summary-item">
              <span className="summary-dot pending-dot"></span>
              <span>Pending</span>
              <strong>34</strong>
            </div>
          </div>

          <div className="subscription-total">
            <span>Total Subscriptions</span>
            <strong>324</strong>
          </div>
        </div>
      </div>

      <div className="report-panel top-plans-panel">
        <div className="report-panel-header">
          <div>
            <h3>Top Performing Plans</h3>
            <p>Plans ranked by customer count</p>
          </div>
        </div>

        <div className="top-plans-list">
          {topPlans.map((plan) => (
            <div className="top-plan-row" key={plan.name}>
              <div className="top-plan-info">
                <strong>{plan.name}</strong>
                <span>{plan.customers} customers</span>
              </div>

              <div className="top-plan-progress">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
              </div>

              <strong className="top-plan-revenue">
                {formatCurrency(plan.revenue)}
              </strong>
            </div>
          ))}
        </div>
      </div>

      <div className="report-panel activity-panel">
        <div className="report-panel-header">
          <div>
            <h3>Recent Activity</h3>
            <p>Latest subscription and payment activities</p>
          </div>
        </div>

        <div className="activity-table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Activity</th>
                <th>Plan</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentActivity.map((activity, index) => (
                <tr key={index}>
                  <td className="activity-customer">{activity.customer}</td>
                  <td>{activity.event}</td>
                  <td>{activity.plan}</td>
                  <td>{activity.date}</td>
                  <td>
                    <span className={`activity-status ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reports;