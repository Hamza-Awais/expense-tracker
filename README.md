# Expense Tracker

Expense tracker app made with the MERN stack (MongoDB, Express, React, Node.js). You can add income and expenses, set your savings, and the balance updates live. All transactions are saved in MongoDB Atlas.

## Features

- Add Income and Add Expense buttons (separate buttons, no minus signs needed)
- Savings field (optional) that gets added to your balance
- Balance = savings + income - expense, updates on every add and delete
- An expense bigger than the balance is not allowed, it shows "No balance left for this expense"
- Delete any transaction with the X button
- Savings is stored in localStorage so it stays after refresh
- Transactions are stored in MongoDB Atlas through a REST API

## Tech used

- Frontend: React (Vite)
- Backend: Node.js, Express
- Database: MongoDB with Mongoose, hosted on Atlas

## React hooks used

The task required these 5 hooks:

- useState: expenses list, savings, form fields, error and toast state
- useEffect: fetch all transactions from the API when the app loads
- useRef: focus the description input after adding a transaction, toast timer
- useMemo: income/expense totals and the final balance
- useCallback: handleAdd, handleDelete and saveSavings functions

## How to run

Backend:

1. cd backend
2. npm install
3. copy .env.example to a new file .env and paste your MongoDB connection string in MONGO_URI
4. npm run dev (API runs on http://localhost:5000)

Frontend:

1. cd frontend
2. npm install
3. npm run dev
4. open http://localhost:5173

## Note about .env

The backend .env file has the MongoDB connection string which contains my database password, so it is added in .gitignore and never pushed to GitHub. Only .env.example with placeholder values is committed.
