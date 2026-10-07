# Expense Tracker — MERN Stack

A full-stack expense tracker built with **MongoDB, Express, React and Node.js**. Add income and expenses, optionally enter the money you already have, and watch the balance update live. Data is stored in MongoDB Atlas (cloud).

## Features

- Separate **Add Income** (green) and **Add Expense** (red) buttons — no minus signs needed
- **Total Balance is optional** — an "Add existing balance (optional)" link lets you enter the money you already have; skip it and the app starts from 0
- Live totals: **Your Balance is Rs. ...** line plus **Total Balance**, **Income** and **Expense** chips (balance = total balance + income − expense)
- The saved total balance lives in the browser (`localStorage`) and can be changed any time from the same link
- Transaction list (newest first) with a red **X** delete button on every row; deleting an expense raises the balance, deleting an income lowers it
- Toast messages on add / delete
- Data persisted in **MongoDB Atlas** through a REST API

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React 19 (Vite)                     |
| Backend  | Node.js + Express                   |
| Database | MongoDB (Mongoose ODM, Atlas cloud) |

## Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   └── Expense.js        # Mongoose schema (description, amount, timestamps)
│   ├── routes/
│   │   └── expenses.js       # GET / POST / DELETE handlers
│   ├── app.js                # Express app (cors + json + routes)
│   ├── server.js             # MongoDB connection + listen
│   ├── .env.example          # template for secrets (copy to .env)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # UI + all React hooks
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── vite.config.js        # dev proxy: /api -> http://localhost:5000
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Route              | Body                          | Description              |
| ------ | ------------------ | ----------------------------- | ------------------------ |
| GET    | `/api/expenses`    | —                             | List all, newest first   |
| POST   | `/api/expenses`    | `{ description, amount }`     | Create a transaction     |
| DELETE | `/api/expenses/:id`| —                             | Delete one transaction   |

## React Hooks Used

| Hook         | Where / Why                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `useState`   | transactions list, total balance, form fields, loading, error and toast state |
| `useEffect`  | fetch all transactions once when the app loads                          |
| `useRef`     | return the cursor to the description box after adding; toast timer      |
| `useMemo`    | income/expense totals from the list, and balance = total balance + income − expense |
| `useCallback`| stable `saveTotalBalance`, `handleAdd` and `handleDelete` functions     |

## Setup

Requirements: Node.js 18+ and a free MongoDB Atlas cluster.

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env      # on macOS/Linux: cp .env.example .env
```

Open `backend/.env` and paste your Atlas connection string into `MONGO_URI`
(replace `<username>` and `<password>`). The `.env` file is listed in
`.gitignore`, so your password is never committed.

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite forwards every `/api` request to the
backend, so no extra configuration is needed.

## Security Note

Never commit `backend/.env`. It holds the MongoDB connection string, which
contains the database password. Only `.env.example` (with placeholder values)
is committed.
