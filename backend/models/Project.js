const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Websites', 'Posters', 'Web Invitations', 'Digital Marketing'] 
  },
  shortDescription: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  gallery: [{ type: String }],
  technologies: [{ type: String }],
  projectUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
