const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');


exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({ message: 'Name, email, service and message are required' });
    }

    const inquiry = new Inquiry({
      name,
      email,
      phone: phone || '',
      service,
      message
    });

    await inquiry.save();
    res.status(201).json({ success: true, message: 'Inquiry saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInquiry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
