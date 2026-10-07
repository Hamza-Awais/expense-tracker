import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Expense', expenseSchema)
