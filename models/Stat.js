const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  completedProjects: { type: String, required: true, default: '20+' },
  happyClients: { type: String, required: true, default: '10+' },
  servicesCount: { type: String, required: true, default: '5+' },
  creativeFocus: { type: String, required: true, default: '100%' }
}, { timestamps: true });

module.exports = mongoose.model('Stat', statSchema);
