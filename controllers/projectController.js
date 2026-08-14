const Project = require('../models/Project');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, category, shortDescription, description, thumbnail, gallery, technologies, projectUrl, githubUrl, featured } = req.body;
    
    if (!title || !category || !shortDescription || !description || !thumbnail) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const slug = generateSlug(title);
    
    // Check if slug already exists
    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'A project with this title or slug already exists' });
    }

    // Get max order
    const lastProject = await Project.findOne().sort({ order: -1 });
    const order = lastProject ? lastProject.order + 1 : 1;

    const project = new Project({
      title,
      slug,
      category,
      shortDescription,
      description,
      thumbnail,
      gallery: gallery && gallery.length > 0 ? gallery : [thumbnail],
      technologies: technologies || [],
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      featured: featured || false,
      order
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  const { slug } = req.params;
  
  try {
    const project = await Project.findOne({ slug });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updates = req.body;
    
    // If title changes, update slug
    if (updates.title && updates.title !== project.title) {
      const newSlug = generateSlug(updates.title);
      // Ensure slug uniqueness
      const existing = await Project.findOne({ slug: newSlug });
      if (existing && existing._id.toString() !== project._id.toString()) {
        return res.status(400).json({ message: 'A project with this new title/slug already exists' });
      }
      project.slug = newSlug;
    }

    // Update fields
    const fields = [
      'title', 'category', 'shortDescription', 'description', 'thumbnail', 
      'gallery', 'technologies', 'projectUrl', 'githubUrl', 'featured', 'order'
    ];

    fields.forEach(field => {
      if (updates[field] !== undefined) {
        project[field] = updates[field];
      }
    });

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { slug } = req.params;

  try {
    const project = await Project.findOneAndDelete({ slug });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Re-adjust display orders to close gaps
    const projects = await Project.find().sort({ order: 1 });
    for (let i = 0; i < projects.length; i++) {
      projects[i].order = i + 1;
      await projects[i].save();
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reorderProjects = async (req, res) => {
  const { slugs } = req.body;

  try {
    if (!slugs || !Array.isArray(slugs)) {
      return res.status(400).json({ message: 'Slugs array is required' });
    }

    // Update order for each slug in list
    for (let idx = 0; idx < slugs.length; idx++) {
      await Project.findOneAndUpdate({ slug: slugs[idx] }, { order: idx + 1 });
    }

    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
