import express from 'express'
import cors from 'cors'
import expenseRoutes from './routes/expenses.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Expense Tracker API is running' })
})

app.use('/api/expenses', expenseRoutes)

export default app
