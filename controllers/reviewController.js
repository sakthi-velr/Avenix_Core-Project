const Review = require('../models/Review');

exports.getPublicReviews = async (req, res) => {
  try {
    const approvedReviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(approvedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitReview = async (req, res) => {
  try {
    const { name, email, rating, service, message } = req.body;

    if (!name || !email || !rating || !service || !message) {
      return res.status(400).json({ message: 'Name, email, rating, service and message are required' });
    }

    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    const dateStr = new Date().toLocaleDateString('en-US', options);

    const review = new Review({
      name,
      email,
      rating,
      service,
      message,
      date: dateStr,
      status: 'pending' // default to pending
    });

    const saved = await review.save();
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully. It will appear publicly once approved by an administrator.',
      review: saved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.hideReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndUpdate(id, { status: 'hidden' }, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
