# Brightloop – Subscription Management System

<p align="center">
  <strong>A Role-Based Subscription, Billing and Management Platform</strong>
</p>

Brightloop is a web-based Subscription Management System designed to simplify and centralize subscription operations. It provides a unified platform for managing products, product variants, subscription plans, customers, subscriptions, quotations, invoices, payments, discounts and reports.

The system follows a role-based architecture with three user roles: Administrator, Staff and Customer.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Objectives](#2-project-objectives)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [User Roles](#5-user-roles-and-access-control)
6. [Modules and Features](#6-modules-and-features)
7. [Project Structure](#7-project-directory-structure)
8. [Installation and Setup](#8-installation-and-setup)
9. [API Documentation](#9-api-documentation)
10. [Database](#10-database-design)
11. [Security](#11-security)
12. [Testing](#12-testing)
13. [Implementation Status](#13-implementation-status)
14. [Limitations and Future Enhancements](#14-limitations-and-future-enhancements)
15. [Contributors](#15-contributors)

---

## 1. Project Overview

Subscription-based businesses require efficient management of products, subscription plans, recurring billing, customer accounts, invoices and payments.

Brightloop provides a centralized application to manage these operations through a web-based interface.

The application consists of three major layers:

- **Frontend:** React.js application for user interaction.
- **Backend:** FastAPI application for business logic and REST API services.
- **Database:** SQLite database for persistent data storage.

The backend handles authentication, authorization, subscription operations and billing-related functionality.

---

## 2. Project Objectives

- Centralize subscription management operations.
- Simplify product and subscription plan creation.
- Manage customer subscriptions and their lifecycle.
- Support invoice generation and billing calculations.
- Maintain payment and invoice records.
- Configure and validate promotional discounts.
- Provide reports for monitoring subscription activities.
- Implement role-based access control.
- Provide a user-friendly interface for administrators, staff and customers.

---

## 3. Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Frontend Build Tool | Vite |
| Backend | Python |
| Backend Framework | FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Data Validation | Pydantic |
| Authentication | JWT |
| Password Security | Passlib, bcrypt |
| API Architecture | REST API |
| API Documentation | Swagger UI |
| Version Control | Git and GitHub |

---

## 4. System Architecture

Brightloop follows a client-server architecture.

```text
                       USERS
                         |
                         v
                  REACT FRONTEND
                      (VITE)
                         |
                         v
                    REST APIs
                         |
                         v
                  FASTAPI BACKEND
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
       AUTHENTICATION  SUBSCRIPTION  BILLING
          MODULE        MODULE       MODULE
             |           |           |
             +-----------+-----------+
                         |
                         v
                     SQLALCHEMY
                         |
                         v
                   SQLITE DATABASE

---

## 5. User Roles and Access Control

Brightloop implements Role-Based Access Control (RBAC).

### 5.1 Administrator

The Administrator manages the overall platform.

Responsibilities:

- Manage products.
- Create and manage product variants.
- Configure subscription plans.
- Manage subscriptions.
- Manage discounts.
- Monitor invoices and payments.
- Access reports.
- Manage platform operations.

### 5.2 Staff

Staff members support operational activities based on their assigned permissions.

Typical responsibilities include:

- Subscription administration.
- Billing support.
- Invoice management.
- Payment record management.
- Customer assistance.

### 5.3 Customer

Customers access their subscription-related information.

Customer-facing functionality includes:

- View available products.
- Explore subscription plans.
- View subscription information.
- Access invoices.
- View payment records.
- Access the customer dashboard.

Access to individual operations is con# Brightloop -- Subscription Management System

```{=html}
<p align="center">
```
`<strong>`{=html}A Role-Based Subscription, Billing and Management
Platform`</strong>`{=html}
```{=html}
</p>
```
Brightloop is a web-based Subscription Management System designed to
simplify and centralize subscription operations. It provides a unified
platform for managing products, product variants, subscription plans,
customers, subscriptions, quotations, invoices, payments, discounts and
reports.

The system follows a role-based architecture with three user roles:
**Administrator, Staff and Customer**.

------------------------------------------------------------------------

## Table of Contents

1.  [Project Overview](#1-project-overview)
2.  [Project Objectives](#2-project-objectives)
3.  [Technology Stack](#3-technology-stack)
4.  [System Architecture](#4-system-architecture)
5.  [User Roles and Access Control](#5-user-roles-and-access-control)
6.  [Modules and Features](#6-modules-and-features)
7.  [Project Directory Structure](#7-project-directory-structure)
8.  [Installation and Setup](#8-installation-and-setup)
9.  [API Documentation](#9-api-documentation)
10. [Database Design](#10-database-design)
11. [Security](#11-security)
12. [Testing](#12-testing)
13. [Implementation Status](#13-implementation-status)
14. [Limitations and Future
    Enhancements](#14-limitations-and-future-enhancements)
15. [Application Screenshots](#15-application-screenshots)
16. [Demo](#16-demo)
17. [Contributors](#17-contributors)
18. [License](#18-license)

------------------------------------------------------------------------

## 1. Project Overview

Subscription-based businesses need an organized way to manage products,
subscription plans, recurring billing, customer accounts, invoices and
payments.

Brightloop provides a centralized web application for managing these
operations through a role-based interface.

The application consists of three major layers:

-   **Frontend:** React.js application for user interaction.
-   **Backend:** FastAPI application for business logic and REST API
    services.
-   **Database:** SQLite database for persistent data storage.

The backend handles authentication, authorization, subscription
operations and billing-related functionality.

### Key Goals

-   Simplify subscription administration.
-   Organize products, plans and customer subscriptions.
-   Support invoice and payment record management.
-   Provide role-based access to platform functionality.
-   Present subscription and billing information through dashboards and
    reports.

------------------------------------------------------------------------

## 2. Project Objectives

-   Centralize subscription management operations.
-   Simplify product and subscription plan creation.
-   Manage customer subscriptions and their lifecycle.
-   Support invoice generation and billing calculations.
-   Maintain payment and invoice records.
-   Configure and validate promotional discounts.
-   Provide reports for monitoring subscription activities.
-   Implement role-based access control.
-   Provide a user-friendly interface for administrators, staff and
    customers.

------------------------------------------------------------------------

## 3. Technology Stack

  Component             Technology
  --------------------- ------------------------------
  Frontend              React.js
  Frontend Build Tool   Vite
  Backend Language      Python
  Backend Framework     FastAPI
  Database              SQLite
  ORM                   SQLAlchemy
  Data Validation       Pydantic
  Authentication        JSON Web Tokens (JWT)
  Password Security     Passlib, bcrypt
  API Architecture      REST API
  API Documentation     Swagger UI (FastAPI OpenAPI)
  Version Control       Git and GitHub

------------------------------------------------------------------------

## 4. System Architecture

Brightloop follows a client-server architecture. The frontend
communicates with the backend through REST API endpoints. The backend
processes requests, applies business rules and interacts with the
database through SQLAlchemy.

``` text
                       USERS
                         |
                         v
                  REACT FRONTEND
                      (VITE)
                         |
                         v
                    REST APIs
                         |
                         v
                  FASTAPI BACKEND
                         |
             +-----------+-----------+
             |           |           |
             v           v           v
       AUTHENTICATION  SUBSCRIPTION  BILLING
          MODULE        MODULE       MODULE
             |           |           |
             +-----------+-----------+
                         |
                         v
                     SQLALCHEMY
                         |
                         v
                   SQLITE DATABASE
```

### Application Layers

1.  **Presentation Layer:** React components and pages provide the user
    interface.
2.  **API Layer:** FastAPI exposes endpoints for frontend and client
    requests.
3.  **Business Logic Layer:** Backend modules handle authentication,
    subscriptions and billing operations.
4.  **Data Layer:** SQLAlchemy maps application models to records stored
    in SQLite.

------------------------------------------------------------------------

## 5. User Roles and Access Control

Brightloop implements Role-Based Access Control (RBAC). Available
operations depend on the authenticated user's role and the authorization
rules applied by the backend.

### 5.1 Administrator

The Administrator manages the overall platform.

Typical responsibilities include:

-   Manage products.
-   Create and manage product variants.
-   Configure subscription plans.
-   Manage subscriptions.
-   Manage discounts.
-   Monitor invoices and payments.
-   Access reports.
-   Manage platform operations.

### 5.2 Staff

Staff members support operational activities based on their assigned
permissions.

Typical responsibilities include:

-   Subscription administration.
-   Billing support.
-   Invoice management.
-   Payment record management.
-   Customer assistance.

*The exact permissions available to staff depend on the backend
authorization rules.*

### 5.3 Customer

Customers access their subscription-related information.

Customer-facing functionality includes:

-   View available products.
-   Explore subscription plans.
-   View subscription information.
-   Access invoices.
-   View payment records.
-   Access the customer dashboard.

Access to individual operations is controlled by backend authorization.
Subscription creation is currently restricted to authorized
administrative roles; customer self-service subscription creation should
not be assumed to be available.

------------------------------------------------------------------------

## 6. Modules and Features

### 6.1 Authentication Module

Handles user authentication and account management.

Features:

-   Customer registration.
-   User login.
-   Password hashing.
-   JWT token generation.
-   Token expiration.
-   Role-based authorization.
-   Protected API endpoints.

Authentication APIs:

  Method   Endpoint               Description
  -------- ---------------------- ---------------------
  POST     `/api/auth/register`   Register a customer
  POST     `/api/auth/login`      Authenticate a user

Login uses form-encoded credentials, with the email address supplied as
the `username` field.

### 6.2 Product Management

Manages the products offered through the platform.

Features:

-   Create products.
-   View products.
-   Manage product information.
-   Configure product types.
-   Maintain sales prices and cost information.
-   Associate product variants.

Example product:

  Field          Example
  -------------- -----------------------
  Product Name   Premium Cloud Storage
  Product Type   Service
  Sales Price    ₹999
  Cost           ₹450

### 6.3 Product Variants

Allows different configurations of a product.

Example:

  Product                 Variant                Additional Price
  ----------------------- -------------------- ------------------
  Premium Cloud Storage   Enterprise Edition                 ₹500

### 6.4 Subscription Plan Management

Allows administrators to define subscription offerings.

Features:

-   Create subscription plans.
-   Configure plan pricing.
-   Select billing intervals.
-   Set minimum quantities.
-   Configure plan availability.
-   Enable or disable renewal options.
-   Configure pause and early-closure options.

Example plan:

  Field               Example
  ------------------- -----------------------
  Plan Name           Premium Monthly Plan
  Product             Premium Cloud Storage
  Price               ₹999
  Billing Frequency   Monthly
  Minimum Quantity    1

### 6.5 Subscription Management

Handles subscription records and their lifecycle information.

Features:

-   Create subscriptions through authorized roles.
-   Associate customers with plans.
-   Configure subscription quantities.
-   Maintain subscription dates.
-   Track subscription status.
-   Maintain next billing dates.
-   Manage subscription information.

Subscription information includes:

-   Subscription ID.
-   Customer ID.
-   Plan ID.
-   Start date.
-   Expiry date.
-   Next billing date.
-   Quantity.
-   Payment terms.
-   Status.

### 6.6 Quotation Management

Provides a quotation-related interface for subscription sales workflows.

Quotation line-item integration and complete quotation processing
require further verification.

### 6.7 Billing and Invoice Management

The billing module handles invoice-related operations.

Responsibilities include:

-   Generate invoices for subscriptions.
-   Calculate applicable discounts.
-   Support tax calculations.
-   Track invoice status.
-   Identify overdue invoices.
-   Maintain billing records.

**Tax configuration:** The current default tax rate is 0% unless
configured otherwise.

### 6.8 Payment Management

Maintains payment records associated with billing operations.

Features:

-   Record payments.
-   Associate payments with invoices.
-   Maintain payment status.
-   Track payment information.
-   Support payment-related reporting.

External payment gateway integration is not currently included. Payments
are maintained as application records rather than processed through a
live gateway.

### 6.9 Discount Management

Supports promotional discount configuration.

Responsibilities include:

-   Create discounts.
-   Configure discount values.
-   Maintain validity information.
-   Validate discount eligibility.
-   Enforce applicable usage restrictions.

Product-specific discount application across subscriptions requires
further integration.

### 6.10 Reports and Analytics

Provides reporting interfaces for subscription and billing information.

Reporting areas include:

-   Subscription information.
-   Invoice information.
-   Payment records.
-   Revenue-related information.
-   Billing activity.

### 6.11 Dashboard

The dashboard provides a centralized interface for displaying
subscription-related information.

Dashboard sections include:

-   Revenue overview.
-   Active subscription summary.
-   Customer information.
-   Overdue invoice indicators.
-   Recent subscriptions.
-   Subscription status distribution.

**Data note:** Verify that dashboard figures and charts are connected to
live backend records before describing them as real-time analytics. Any
sample or static figures should be identified as demonstration data.

------------------------------------------------------------------------

## 7. Project Directory Structure

The following is a representative project structure. Update it if the
actual repository layout differs.

``` text
subscription_management_system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   ├── seed_admin.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   └── billing.py
│   ├── requirements.txt
│   ├── .env.example
│   └── brightloop.db              # Local database; do not commit
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   └── Auth.css
│   │   ├── pages/
│   │   │   ├── Products.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── Subscriptions.jsx
│   │   │   ├── Quotations.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Discounts.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

## 8. Installation and Setup

### 8.1 Prerequisites

Install the following before running the project:

-   Python 3.10 or a compatible version.
-   Node.js and npm.
-   Git.
-   A code editor such as Visual Studio Code.

### 8.2 Clone the Repository

``` bash
git clone https://github.com/Gayathri-Jayan/subscription_management_system.git
cd subscription_management_system
```

### 8.3 Backend Setup

Navigate to the backend directory:

``` bash
cd backend
```

Create a virtual environment:

``` bash
python -m venv venv
```

Activate it on Windows PowerShell:

``` powershell
.\venv\Scripts\Activate.ps1
```

On Windows Command Prompt:

``` cmd
venv\Scripts\activate
```

Install the Python dependencies:

``` bash
pip install -r requirements.txt
```

### 8.4 Environment Configuration

Create a `.env` file inside the `backend/` directory. Use the following
as a template:

``` env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
SECRET_KEY=replace_with_a_long_random_secret
```

If the repository includes `.env.example`, copy it to `.env` and fill in
the values.

**Security notes:**

-   Never commit `.env` to GitHub.
-   Use a strong, unique administrator password.
-   Use a randomly generated secret key of at least 32 characters.
-   Do not share access tokens or credentials in screenshots or demo
    recordings.

### 8.5 Initialize the Administrator Account

If the project uses the administrator seed script, run:

``` bash
python -m app.seed_admin
```

Use the configured environment variables. Do not publish the
administrator credentials in this README.

### 8.6 Start the Backend Server

From the `backend/` directory:

``` bash
python -m uvicorn app.main:app --reload
```

Backend base URL:

`http://127.0.0.1:8000`

Health endpoint, if enabled:

`http://127.0.0.1:8000/health`

### 8.7 Frontend Setup

Open a second terminal and navigate to the frontend directory from the
project root:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start the Vite development server:

``` bash
npm run dev
```

Frontend development URL:

`http://localhost:5173`

Keep both the backend and frontend servers running while using the
application.

------------------------------------------------------------------------

## 9. API Documentation

The backend exposes REST API endpoints through FastAPI.

When the backend is running, interactive API documentation is available
at:

-   **Swagger UI:** `http://127.0.0.1:8000/docs`
-   **ReDoc:** `http://127.0.0.1:8000/redoc`

The API groups cover the application's main functional areas:

  API Prefix / Area   Purpose
  ------------------- ------------------------------------
  `/api/auth`         Registration and login
  Products            Product management
  Plans               Subscription plan management
  Subscriptions       Subscription records and lifecycle
  Invoices            Invoice management
  Payments            Payment records
  Discounts           Discount management
  Reports             Reporting information

Consult the running Swagger documentation for the exact route paths,
HTTP methods, request schemas, response schemas and authorization
requirements. Endpoint paths beyond authentication should be verified
against the implemented routers.

------------------------------------------------------------------------

## 10. Database Design

Brightloop uses SQLite for persistent data storage and SQLAlchemy as its
Object Relational Mapper (ORM).

The database stores application information such as:

-   User accounts and roles.
-   Products and product variants.
-   Subscription plans.
-   Customer subscriptions.
-   Invoices.
-   Payment records.
-   Discounts.

### Data Access Flow

``` text
Frontend Request
       |
       v
   FastAPI Router
       |
       v
 Business Logic
       |
       v
 SQLAlchemy ORM
       |
       v
  SQLite Database
```

SQLAlchemy models represent application entities, while Pydantic schemas
are used for request and response validation.

**Database note:** The current development setup uses SQLite. Schema
changes to an existing database may require a migration or a fresh
development database. `create_all()` creates missing tables but does not
automatically alter existing tables to add new columns.

------------------------------------------------------------------------

## 11. Security

Security-related mechanisms implemented in the backend include:

-   Password hashing before storage.
-   JWT-based authentication.
-   Token expiration.
-   Role-based authorization.
-   Protected API endpoints.
-   Environment-based configuration for sensitive values.
-   CORS configuration for the frontend development origin.

### Security Recommendations

-   Keep secret keys and passwords out of source control.
-   Use HTTPS in production.
-   Restrict CORS to trusted origins.
-   Add rate limiting to authentication endpoints before production
    deployment.
-   Use a managed database and migration process for production.
-   Review role permissions and object-level access before deployment.
-   Rotate any credentials that have been exposed.

------------------------------------------------------------------------

## 12. Testing

Testing should cover the backend APIs, authorization rules, billing
calculations and frontend workflows.

Recommended verification areas:

  Area             What to Verify
  ---------------- -------------------------------------------------
  Authentication   Registration, login and invalid credentials
  Authorization    Access allowed or denied according to user role
  Products         Product creation and retrieval
  Plans            Plan creation and configuration
  Subscriptions    Subscription creation and status information
  Invoices         Invoice records and billing calculations
  Payments         Payment record creation and invoice association
  Discounts        Discount validation and eligibility
  Reports          Correctness of returned report data
  Frontend         Login, navigation and API integration

Run automated tests, if configured, from the backend directory:

``` bash
pytest
```

Only report tests as passed when they have actually been executed
successfully.

------------------------------------------------------------------------

## 13. Implementation Status

The following table distinguishes implemented areas from functionality
that still needs verification or additional development.

  -----------------------------------------------------------------------
  Feature                             Status
  ----------------------------------- -----------------------------------
  User registration and login         Implemented

  JWT authentication                  Implemented

  Role-based authorization            Implemented in backend; verify each
                                      role's permissions

  Product management                  Implemented; verify complete
                                      frontend/API integration

  Product variants                    Backend support available; verify
                                      UI integration

  Subscription plans                  Implemented; verify all plan
                                      options

  Subscription management             Implemented for authorized roles

  Quotation line items and complete   Requires further verification
  workflow                            

  Invoice and billing operations      Implemented; verify all billing
                                      scenarios

  Payment record management           Implemented

  Live payment gateway                Not implemented

  Discount management                 Implemented; product-specific
                                      subscription application needs
                                      further integration

  Reports                             Available; verify data accuracy

  Live dashboard analytics            Requires backend data integration
                                      and verification

  Automated recurring invoice         Requires an external scheduler or
  scheduling                          scheduled execution

  Customer self-service subscription  Not currently enabled
  creation                            
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Limitations and Future Enhancements

### Current Limitations

-   No external payment gateway integration.
-   No complete password-reset email workflow.
-   Quotation line-item processing requires further implementation or
    verification.
-   Product-specific discount application across subscriptions needs
    additional integration.
-   Recurring invoice generation requires the scheduler to be invoked by
    an external scheduled process.
-   The default tax rate is 0% unless configured otherwise.
-   SQLite is used for the current development setup.
-   Monetary fields use floating-point representation; production
    financial workflows should use precise decimal arithmetic.
-   Existing database schema changes require an explicit migration
    process.
-   Some dashboard figures may be demonstration data until connected to
    live backend records.

### Future Enhancements

-   Integrate payment gateways such as Razorpay or Stripe.
-   Add automated recurring invoice generation and renewal reminders.
-   Introduce email notifications for invoices, payments and
    subscription updates.
-   Enable customer self-service subscription creation, pause and
    cancellation where appropriate.
-   Add password reset and email verification.
-   Improve quotation creation with line items and complete processing.
-   Extend product-specific discount support.
-   Add advanced revenue and subscription analytics.
-   Introduce database migrations using a migration tool such as
    Alembic.
-   Use precise decimal types for financial calculations.
-   Deploy the application to a cloud hosting platform.
-   Add comprehensive automated tests and continuous integration.

------------------------------------------------------------------------

## 15. Application Screenshots

Screenshots can be added to demonstrate the actual application
interface.

Create a `docs/screenshots/` directory and add screenshots with the
filenames shown below, or update the paths to match your repository.

### 15.1 Login Page

```{=html}
<!-- Add screenshot: docs/screenshots/login.png -->
```
### 15.2 Administrator Dashboard

```{=html}
<!-- Add screenshot: docs/screenshots/admin-dashboard.png -->
```
### 15.3 Customer Dashboard

```{=html}
<!-- Add screenshot: docs/screenshots/customer-dashboard.png -->
```
### 15.4 Product and Plan Management

```{=html}
<!-- Add screenshot: docs/screenshots/products-plans.png -->
```
### 15.5 Subscription Management

```{=html}
<!-- Add screenshot: docs/screenshots/subscriptions.png -->
```
### 15.6 Invoices and Payments

```{=html}
<!-- Add screenshot: docs/screenshots/invoices-payments.png -->
```
To display a screenshot, replace the relevant comment with an image
reference, for example:

``` markdown
![Brightloop Login Page](docs/screenshots/login.png)
```

------------------------------------------------------------------------

## 16. Demo

A project demonstration video can be added here.

**Demo Video:** Add your publicly accessible demo video link.

The demonstration can cover:

1.  Administrator login and dashboard.
2.  Product and product variant management.
3.  Subscription plan configuration.
4.  Subscription administration.
5.  Invoice and payment record management.
6.  Customer login and customer dashboard.
7.  Reports and analytics.

------------------------------------------------------------------------

## 17. Contributors

Brightloop was developed collaboratively by:

  Contributor      Role
  ---------------- ---------------------------------
  Ayisha Saniya    Team Member
  Drushya Jolly    Team Member
  Gayathri Jayan   Team Member

------------------------------------------------------------------------

## 18. License

This project was developed as part of the **Odoo × Make-A-Ton 9.0 Kochi
Hackathon 2026**.

No open-source license has been specified yet. Add a license file and
update this section if the project is intended for public reuse.

------------------------------------------------------------------------

```{=html}
<p align="center">
```
`<strong>`{=html}Brightloop -- Simplifying Subscription
Management`</strong>`{=html}
```{=html}
</p>
```
trolled by backend authorization.

---

## 6. Modules and Features

### 6.1 Authentication Module

Handles user authentication and account management.

Features:

- User registration.
- User login.
- Password hashing.
- JWT token generation.
- Token expiration.
- Role-based authorization.
- Protected API endpoints.

Authentication APIs:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Authenticate a user |

Login uses form-encoded credentials, with the email address supplied as the username.

### 6.2 Product Management

Manages the products offered through the platform.

Features:

- Create products.
- View products.
- Manage product information.
- Configure product types.
- Maintain sales prices and cost information.
- Associate product variants.

Example:

| Field | Example |
|---|---|
| Product Name | Premium Cloud Storage |
| Product Type | Service |
| Sales Price | ₹999 |
| Cost | ₹450 |

### 6.3 Product Variants

Allows different configurations of a product.

Example:

| Product | Variant | Additional Price |
|---|---|---|
| Premium Cloud Storage | Enterprise Edition | ₹500 |

### 6.4 Subscription Plan Management

Allows administrators to define subscription offerings.

Features:

- Create subscription plans.
- Configure plan pricing.
- Select billing intervals.
- Set minimum quantities.
- Configure plan availability.
- Enable or disable renewal options.
- Configure pause and early closure options.

Example:

| Field | Example |
|---|---|
| Plan Name | Premium Monthly Plan |
| Product | Premium Cloud Storage |
| Price | ₹999 |
| Billing Frequency | Monthly |
| Minimum Quantity | 1 |

### 6.5 Subscription Management

Handles subscription records and their lifecycle information.

Features:

- Create subscriptions.
- Associate customers with plans.
- Configure subscription quantities.
- Maintain subscription dates.
- Track subscription status.
- Maintain next billing dates.
- Manage subscription information.

Subscription information includes:

- Subscription ID.
- Customer ID.
- Plan ID.
- Start Date.
- Expiry Date.
- Next Billing Date.
- Quantity.
- Payment Terms.
- Status.

### 6.6 Quotation Management

Provides a quotation-related interface for subscription sales workflows.

Quotation line-item integration and complete quotation processing require further verification.

### 6.7 Billing and Invoice Management

The Billing and Database module handles invoice-related operations.

Responsibilities:

- Generate invoices for subscriptions.
- Calculate applicable discounts.
- Support tax calculations.
- Track invoice status.
- Identify overdue invoices.
- Prevent duplicate invoice generation.
- Maintain billing records.

**Tax configuration:** The current default tax rate is 0% unless configured otherwise.

### 6.8 Payment Management

Maintains payment records associated with billing operations.

Features:

- Record payments.
- Associate payments with invoices.
- Maintain payment status.
- Track payment information.
- Support payment-related reporting.

External payment gateway integration is not currently included.

### 6.9 Discount Management

Supports promotional discount configuration.

Responsibilities:

- Create discounts.
- Configure discount values.
- Maintain validity information.
- Validate discount eligibility.
- Enforce applicable usage restrictions.

Product-specific discount application across subscriptions requires further integration.

### 6.10 Reports and Analytics

Provides reporting interfaces for subscription and billing information.

Reporting areas include:

- Subscription information.
- Invoice information.
- Payment records.
- Revenue-related information.
- Billing activity.

### 6.11 Dashboard

The dashboard provides a centralized interface for displaying subscription-related information.

Dashboard sections include:

- Revenue overview.
- Active subscription summary.
- Customer information.
- Overdue invoice indicators.
- Recent subscriptions.
- Subscription status distribution.

Dashboard figures should be connected to backend data before being represented as live analytics.

---

## 7. Project Directory Structure

```text
subscription_management_system/
│
├── backend/
│   │
│   ├── app/
│   │   ├── main.py
│   │   ├── auth.py
│   │   ├── dependencies.py
│   │   ├── seed_admin.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   │
│   │   └── billing.py
│   │
│   ├── requirements.txt
│   ├── .env
│   └── brightloop.db
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Auth.jsx
│   │   │   └── Auth.css
│   │   │
│   │   ├── pages/
│   │   │   ├── Products.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── Subscriptions.jsx
│   │   │   ├── Quotations.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Discounts.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
