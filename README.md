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

Access to individual operations is controlled by backend authorization.

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
