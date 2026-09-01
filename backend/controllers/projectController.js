const mongoose = require('mongoose');
const Project = require('../models/Project');

const generateSlug = (title) => {
  const slug = (title || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || `project-${Date.now()}`;
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 });
    res.json(projects);
  } catch (error) {
    console.error('Error in getProjects:', error);
    res.status(500).json({ message: error.message || 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { 
      title, category, shortDescription, description, thumbnail, 
      gallery, technologies, projectUrl, githubUrl, featured, order 
    } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Project category is required' });
    }
    if (!shortDescription || !shortDescription.trim()) {
      return res.status(400).json({ message: 'Short description is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: 'Full description is required' });
    }
    if (!thumbnail || !thumbnail.trim()) {
      return res.status(400).json({ message: 'Thumbnail image URL is required' });
    }

    let slug = generateSlug(title);
    
    // Ensure slug uniqueness
    const existingWithSlug = await Project.findOne({ slug });
    if (existingWithSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    // Determine order
    let projectOrder = order;
    if (typeof projectOrder !== 'number' || isNaN(projectOrder)) {
      const lastProject = await Project.findOne().sort({ order: -1 });
      projectOrder = lastProject && typeof lastProject.order === 'number' ? lastProject.order + 1 : 1;
    }

    const techArray = Array.isArray(technologies) 
      ? technologies 
      : (typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()).filter(Boolean) : []);

    const galleryArray = Array.isArray(gallery) && gallery.length > 0 
      ? gallery 
      : [thumbnail.trim()];

    const project = new Project({
      title: title.trim(),
      slug,
      category,
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      thumbnail: thumbnail.trim(),
      gallery: galleryArray,
      technologies: techArray,
      projectUrl: projectUrl ? projectUrl.trim() : '',
      githubUrl: githubUrl ? githubUrl.trim() : '',
      featured: Boolean(featured),
      order: projectOrder
    });

    const saved = await project.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: error.message || 'Failed to create project' });
  }
};

exports.updateProject = async (req, res) => {
  const id = req.params.id || req.params.slug;

  try {
    let project = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id);
    }
    if (!project) {
      project = await Project.findOne({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updates = req.body;

    // If title changed, update slug safely
    if (updates.title && updates.title.trim() && updates.title.trim() !== project.title) {
      let newSlug = generateSlug(updates.title.trim());
      const existing = await Project.findOne({ slug: newSlug });
      if (existing && existing._id.toString() !== project._id.toString()) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      project.title = updates.title.trim();
      project.slug = newSlug;
    }

    if (updates.category !== undefined) project.category = updates.category;
    if (updates.shortDescription !== undefined) project.shortDescription = updates.shortDescription.trim();
    if (updates.description !== undefined) project.description = updates.description.trim();
    if (updates.thumbnail !== undefined) project.thumbnail = updates.thumbnail.trim();
    if (updates.gallery !== undefined) {
      project.gallery = Array.isArray(updates.gallery) && updates.gallery.length > 0 
        ? updates.gallery 
        : [project.thumbnail];
    }
    if (updates.technologies !== undefined) {
      project.technologies = Array.isArray(updates.technologies) 
        ? updates.technologies 
        : (typeof updates.technologies === 'string' ? updates.technologies.split(',').map(t => t.trim()).filter(Boolean) : []);
    }
    if (updates.projectUrl !== undefined) project.projectUrl = updates.projectUrl.trim();
    if (updates.githubUrl !== undefined) project.githubUrl = updates.githubUrl.trim();
    if (updates.featured !== undefined) project.featured = Boolean(updates.featured);
    if (updates.order !== undefined && typeof updates.order === 'number') project.order = updates.order;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    console.error('Error in updateProject:', error);
    res.status(500).json({ message: error.message || 'Failed to update project' });
  }
};

exports.deleteProject = async (req, res) => {
  const id = req.params.id || req.params.slug;

  try {
    let project = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findByIdAndDelete(id);
    }
    if (!project) {
      project = await Project.findOneAndDelete({ slug: id });
    }

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Re-adjust display orders to close gaps
    const remainingProjects = await Project.find().sort({ order: 1, createdAt: 1 });
    for (let i = 0; i < remainingProjects.length; i++) {
      if (remainingProjects[i].order !== i + 1) {
        remainingProjects[i].order = i + 1;
        await remainingProjects[i].save();
      }
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProject:', error);
    res.status(500).json({ message: error.message || 'Failed to delete project' });
  }
};

exports.reorderProjects = async (req, res) => {
  const { slugs, ids } = req.body;
  const list = ids || slugs;

  try {
    if (!list || !Array.isArray(list)) {
      return res.status(400).json({ message: 'Array of project IDs or slugs is required' });
    }

    for (let idx = 0; idx < list.length; idx++) {
      const item = list[idx];
      if (mongoose.Types.ObjectId.isValid(item)) {
        await Project.findByIdAndUpdate(item, { order: idx + 1 });
      } else {
        await Project.findOneAndUpdate({ slug: item }, { order: idx + 1 });
      }
    }

    const projects = await Project.find().sort({ order: 1, createdAt: 1 });
    res.json(projects);
  } catch (error) {
    console.error('Error in reorderProjects:', error);
    res.status(500).json({ message: error.message || 'Failed to reorder projects' });
  }
};

