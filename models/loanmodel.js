const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  customerName: { type: String, required: true },
  emiData: { type: [] },
  paymentPeriod: { type: Number, required: true },
  foreClosurePayment: { type: Number },
  collectionAgent: { type: String, required: true },
  paymentCycle: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
