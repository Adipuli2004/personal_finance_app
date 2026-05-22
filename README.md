# 💰 Connected Personal Finance Tracker (Master Documentation)

A cross-platform financial tracking system consisting of a React (TypeScript) website and a native Android (Kotlin/Jetpack Compose) application. The ecosystem is driven by a centralized Node.js/Express backend API and a PostgreSQL relational database.

Instead of logging every tiny individual transaction, this application acts as an optimized, stateful "counter" that tracks cumulative subcategory spending totals for a given month.

---

## 🛠️ Unified Tech Stack Blueprint

| Layer | Technology | Language / Specification |
| :--- | :--- | :--- |
| **Backend API** | Express.js (Node.js runtime) | TypeScript |
| **Database** | PostgreSQL | SQL |
| **Web Frontend** | React.js | TypeScript |
| **Mobile App** | Native Android (Jetpack Compose) | Kotlin |

---

## 🏗️ System Architecture & Data Flow

### 1. High-Level Architecture
This diagram outlines how the web dashboard, mobile application, Express API, and cloud PostgreSQL instance communicate.

```mermaid
graph TD
    A[Web Frontend: React/TS] -->|HTTP Requests| C(Backend API: Express/TS)
    B[Mobile Frontend: Android/Kotlin] -->|HTTP Requests| C
    C -->|SQL Queries| D[(Database: PostgreSQL)]
    D -->|Data Payloads| C
    C -->|JSON Responses| A
    C -->|JSON Responses| B
    
    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
```
