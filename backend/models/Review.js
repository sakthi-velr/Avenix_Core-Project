const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  date: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'approved', 'hidden'], 
    default: 'pending' 
  }
}, { 
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
