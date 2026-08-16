const Stat = require('../models/Stat');

exports.getStats = async (req, res) => {
  try {
    let stat = await Stat.findOne();
    if (!stat) {
      // Seed default statistics if database is blank
      stat = await Stat.create({
        completedProjects: '20+',
        happyClients: '10+',
        servicesCount: '5+',
        creativeFocus: '100%'
      });
    }
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStats = async (req, res) => {
  try {
    const { completedProjects, happyClients, servicesCount, creativeFocus } = req.body;

    if (!completedProjects || !happyClients || !servicesCount || !creativeFocus) {
      return res.status(400).json({ message: 'All counter fields are required' });
    }

    let stat = await Stat.findOne();
    if (!stat) {
      stat = new Stat({ completedProjects, happyClients, servicesCount, creativeFocus });
    } else {
      stat.completedProjects = completedProjects;
      stat.happyClients = happyClients;
      stat.servicesCount = servicesCount;
      stat.creativeFocus = creativeFocus;
    }

    const saved = await stat.save();
    res.json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
