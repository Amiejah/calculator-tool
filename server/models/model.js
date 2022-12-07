const mongoose = require('mongoose');
const dataSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String
  },
  answer: {
    required: true,
    type: Number
  }
});

module.exports = mongoose.model('Data', dataSchema)
