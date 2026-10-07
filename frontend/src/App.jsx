import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

function App() {
  const [expenses, setExpenses] = useState([])
  const [savings, setSavings] = useState(() => {
    const saved = localStorage.getItem('et-savings')
    return saved === null ? 0 : Number(saved)
  })
  const [savingsInput, setSavingsInput] = useState('')
  const [editingSavings, setEditingSavings] = useState(false)
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const descriptionRef = useRef(null)
  const toastTimer = useRef(null)

  const showToast = (message, type) => {
    setToast({ message, type })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const res = await fetch('/api/expenses')
        if (!res.ok) throw new Error('Server error')
        const data = await res.json()
        setExpenses(data)
        setError('')
      } catch {
        setError('Could not load expenses. Is the backend (npm run dev) running?')
      } finally {
        setLoading(false)
      }
    }
    loadExpenses()
  }, [])

  const totals = useMemo(
    () =>
      expenses.reduce(
        (acc, item) => {
          if (item.amount >= 0) acc.income += item.amount
          else acc.expense += Math.abs(item.amount)
          return acc
        },
        { income: 0, expense: 0 }
      ),
    [expenses]
  )

  const balance = useMemo(
    () => savings + totals.income - totals.expense,
    [savings, totals]
  )

  const saveSavings = useCallback(() => {
    const value = parseFloat(savingsInput)
    if (isNaN(value) || value < 0) {
      showToast('Enter a valid amount', 'error')
      return
    }
    setSavings(value)
    localStorage.setItem('et-savings', String(value))
    setSavingsInput('')
    setEditingSavings(false)
    showToast('Savings saved', 'success')
  }, [savingsInput])

  const handleAdd = useCallback(
    async (type) => {
      const value = parseFloat(amount)
      if (!description.trim() || isNaN(value) || value <= 0) {
        showToast('Description and an amount greater than 0 are both required', 'error')
        return
      }
      if (type === 'expense' && value > balance) {
        showToast('No balance left for this expense', 'error')
        return
      }
      const signed = type === 'income' ? value : -value
      try {
        const res = await fetch('/api/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description: description.trim(), amount: signed }),
        })
        if (!res.ok) throw new Error('Server error')
        const created = await res.json()
        setExpenses((prev) => [created, ...prev])
        setDescription('')
        setAmount('')
        descriptionRef.current?.focus()
        showToast(type === 'income' ? 'Income added' : 'Expense added', 'success')
      } catch {
        showToast('Could not add the transaction. Please check the backend', 'error')
      }
    },
    [amount, balance, description]
  )

  const handleDelete = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Server error')
      setExpenses((prev) => prev.filter((item) => item._id !== id))
      showToast('Transaction deleted', 'success')
    } catch {
      showToast('Could not delete the transaction', 'error')
    }
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>Expense Tracker</h1>
      </header>

      <p className="balance-line">
        Your Balance is{' '}
        <strong className={balance < 0 ? 'negative' : ''}>Rs. {balance.toFixed(2)}</strong>
      </p>

      <div className="totals-line">
        <span className="chip savings">
          Savings <strong>Rs. {savings.toFixed(2)}</strong>
        </span>
        <span className="chip income">
          Income <strong>Rs. {totals.income.toFixed(2)}</strong>
        </span>
        <span className="chip expense">
          Expense <strong>Rs. {totals.expense.toFixed(2)}</strong>
        </span>
      </div>

      <section className="card">
        {editingSavings && (
          <div className="savings-edit">
            <p className="hint">
              Optional — enter the money you already have. It is added to your balance.
            </p>
            <div className="edit-row">
              <input
                type="number"
                step="any"
                placeholder="e.g. 20000"
                value={savingsInput}
                onChange={(e) => setSavingsInput(e.target.value)}
              />
              <button type="button" className="add-income" onClick={saveSavings}>
                Save
              </button>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setEditingSavings(false)
                  setSavingsInput('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <h2>Add Transaction</h2>

        <label htmlFor="description">Description</label>
        <input
          id="description"
          ref={descriptionRef}
          type="text"
          placeholder="Enter your description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          step="any"
          placeholder="Enter your amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="btn-row">
          <button type="button" className="add-income" onClick={() => handleAdd('income')}>
            Add Income
          </button>
          <button type="button" className="add-expense" onClick={() => handleAdd('expense')}>
            Add Expense
          </button>
        </div>

        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setSavingsInput(savings ? String(savings) : '')
            setEditingSavings(true)
          }}
        >
          {savings ? 'Change savings' : 'Add savings (optional)'}
        </button>
      </section>

      {error && <p className="error-banner">{error}</p>}

      <section className="list">
        <h2>Transactions</h2>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="muted">No transactions yet. Add one using the form above.</p>
        ) : (
          <ul>
            {expenses.map((item) => (
              <li
                key={item._id}
                className={item.amount >= 0 ? 'row income-row' : 'row expense-row'}
              >
                <button
                  type="button"
                  className="delete"
                  title="Delete"
                  onClick={() => handleDelete(item._id)}
                >
                  X
                </button>
                <div className="desc-wrap">
                  <p className="desc">{item.description}</p>
                  <p className="date">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <span className="amt">
                  {item.amount >= 0 ? '+' : '-'} Rs. {Math.abs(item.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  )
}

export default App
