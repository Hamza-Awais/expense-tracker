import { Router } from 'express'
import Expense from '../models/Expense.js'

const router = Router()

// GET /api/expenses — newest first
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 })
    res.json(expenses)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/expenses — body: { description, amount }
router.post('/', async (req, res) => {
  try {
    const { description, amount } = req.body
    const expense = await Expense.create({ description, amount })
    res.status(201).json(expense)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/expenses/:id
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id)
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }
    res.json({ message: 'Expense deleted', id: req.params.id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
