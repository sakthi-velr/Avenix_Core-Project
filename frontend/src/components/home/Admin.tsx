import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X, Check, EyeOff, Layout, BarChart2, MessageSquare, ArrowLeft, ToggleLeft, ToggleRight, Star, LogOut, Lock, User
} from 'lucide-react';
import { 
  getPortfolioProjects, savePortfolioProject, updatePortfolioProject, deletePortfolioProject, reorderProjects,
  getPortfolioStats, savePortfolioStats, getReviews, approveReview, hideReview, deleteReview, 
  loginAdmin, logoutAdmin, isLoggedIn,
  type Project, type FeedbackReview 
} from '../../services/storage';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'projects' | 'stats' | 'reviews'>('projects');
  
  // Login Authentication State
  const [isAuth, setIsAuth] = useState(isLoggedIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // State for loaded data
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<FeedbackReview[]>([]);
  
  // Form visibility and editing states
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  // Project Form Fields
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectShortDesc, setProjectShortDesc] = useState('');
  const [projectCategory, setProjectCategory] = useState<Project['category']>('Websites');
  const [projectTech, setProjectTech] = useState('');
  const [projectThumbnail, setProjectThumbnail] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [projectFeatured, setProjectFeatured] = useState(false);
  const [projectOrder, setProjectOrder] = useState(1);
  
  // Stats form fields
  const [statsCompleted, setStatsCompleted] = useState('');
  const [statsClients, setStatsClients] = useState('');
  const [statsServices, setStatsServices] = useState('');
  const [statsFocus, setStatsFocus] = useState('');

  // Status/Alert State
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load data on mount / auth change
  useEffect(() => {
    if (isAuth) {
      loadAllData();
    }
  }, [isAuth]);

  const loadAllData = () => {
    getPortfolioProjects()
      .then(setProjects)
      .catch(err => console.error('Projects load failed:', err));

    getPortfolioStats()
      .then(loadedStats => {
        setStatsCompleted(loadedStats.completedProjects);
        setStatsClients(loadedStats.happyClients);
        setStatsServices(loadedStats.servicesCount);
        setStatsFocus(loadedStats.creativeFocus);
      })
      .catch(err => console.error('Stats load failed:', err));

    getReviews()
      .then(setReviews)
      .catch(err => console.error('Reviews load failed:', err));
  };

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError('Please fill in both fields.');
      return;
    }
    setAuthError('');
    setIsLoggingIn(true);

    loginAdmin(username.trim(), password.trim())
      .then(() => {
        setIsLoggingIn(false);
        setIsAuth(true);
        showAlert('success', 'Logged in successfully.');
      })
      .catch(err => {
        setIsLoggingIn(false);
        setAuthError(err.message || 'Invalid username or password.');
      });
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuth(false);
    setProjects([]);
    setReviews([]);
    showAlert('success', 'Logged out.');
  };

  // Open form for adding a project
  const handleOpenAddForm = () => {
    setEditingProject(null);
    setProjectTitle('');
    setProjectDesc('');
    setProjectShortDesc('');
    setProjectCategory('Websites');
    setProjectTech('');
    setProjectThumbnail('');
    setProjectUrl('');
    setProjectGithub('');
    setProjectFeatured(false);
    setProjectOrder(projects.length + 1);
    setIsProjectFormOpen(true);
  };

  // Open form for editing a project
  const handleOpenEditForm = (proj: Project) => {
    setEditingProject(proj);
    setProjectTitle(proj.title);
    setProjectDesc(proj.description || '');
    setProjectShortDesc(proj.shortDescription || '');
    setProjectCategory(proj.category);
    setProjectTech(proj.technologies.join(', '));
    setProjectThumbnail(proj.thumbnail);
    setProjectUrl(proj.projectUrl || '');
    setProjectGithub(proj.githubUrl || '');
    setProjectFeatured(proj.featured);
    setProjectOrder(proj.order);
    setIsProjectFormOpen(true);
  };

  // Handle saving / updating project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle.trim() || !projectThumbnail.trim() || !projectShortDesc.trim() || !projectDesc.trim()) {
      showAlert('error', 'Please fill in all required fields.');
      return;
    }

    const techArray = projectTech.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const projectData = {
      title: projectTitle.trim(),
      category: projectCategory,
      shortDescription: projectShortDesc.trim(),
      description: projectDesc.trim(),
      thumbnail: projectThumbnail.trim(),
      gallery: editingProject ? editingProject.gallery : [projectThumbnail.trim()],
      technologies: techArray,
      projectUrl: projectUrl.trim(),
      githubUrl: projectGithub.trim(),
      featured: projectFeatured
    };

    if (editingProject) {
      // Update
      updatePortfolioProject(editingProject.slug, {
        ...projectData,
        order: projectOrder
      })
        .then(() => {
          showAlert('success', 'Project updated successfully.');
          setIsProjectFormOpen(false);
          setEditingProject(null);
          loadAllData();
        })
        .catch(err => {
          showAlert('error', err.message || 'Failed to update project.');
        });
    } else {
      // Save New
      savePortfolioProject(projectData)
        .then(() => {
          showAlert('success', 'New project added successfully.');
          setIsProjectFormOpen(false);
          setEditingProject(null);
          loadAllData();
        })
        .catch(err => {
          showAlert('error', err.message || 'Failed to add project.');
        });
    }
  };

  // Handle deleting project
  const handleDeleteProject = (slug: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deletePortfolioProject(slug)
        .then(deleted => {
          if (deleted) {
            showAlert('success', 'Project deleted successfully.');
            loadAllData();
          } else {
            showAlert('error', 'Failed to delete project.');
          }
        })
        .catch(err => showAlert('error', err.message || 'Failed to delete project.'));
    }
  };

  // Handle project reordering
  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const listCopy = [...projects];
    const temp = listCopy[index];
    listCopy[index] = listCopy[targetIdx];
    listCopy[targetIdx] = temp;

    const slugs = listCopy.map(p => p.slug);
    reorderProjects(slugs)
      .then(() => {
        loadAllData();
        showAlert('success', 'Display order updated.');
      })
      .catch(err => showAlert('error', err.message || 'Failed to reorder projects.'));
  };

  // Save Stats
  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statsCompleted.trim() || !statsClients.trim() || !statsServices.trim() || !statsFocus.trim()) {
      showAlert('error', 'All stats fields must be filled.');
      return;
    }

    savePortfolioStats({
      completedProjects: statsCompleted.trim(),
      happyClients: statsClients.trim(),
      servicesCount: statsServices.trim(),
      creativeFocus: statsFocus.trim()
    })
      .then(() => {
        showAlert('success', 'Statistics saved successfully.');
        loadAllData();
      })
      .catch(err => showAlert('error', err.message || 'Failed to save stats.'));
  };

  // Reviews actions
  const handleApproveReview = (id: string) => {
    approveReview(id)
      .then(() => {
        showAlert('success', 'Review approved and published.');
        loadAllData();
      })
      .catch(err => showAlert('error', err.message || 'Failed to approve review.'));
  };

  const handleHideReview = (id: string) => {
    hideReview(id)
      .then(() => {
        showAlert('success', 'Review hidden from public site.');
        loadAllData();
      })
      .catch(err => showAlert('error', err.message || 'Failed to hide review.'));
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(id)
        .then(() => {
          showAlert('success', 'Review deleted.');
          loadAllData();
        })
        .catch(err => showAlert('error', err.message || 'Failed to delete review.'));
    }
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-black text-brand-textPrimary font-body flex items-center justify-center py-12 px-6 relative overflow-hidden">
        {/* Background glow overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[130px] pointer-events-none" />
        
        <div className="max-w-md w-full bg-brand-dark-2/60 border border-brand-green/10 p-8 rounded-2xl backdrop-blur-md relative z-10 space-y-8 shadow-[0_0_50px_rgba(116,255,158,0.05)]">
          <div className="text-center space-y-2 select-none">
            <div className="inline-flex items-center justify-center p-3 bg-brand-dark-green/10 border border-brand-green/10 text-brand-green rounded-2xl mb-2">
              <Lock className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h1 className="font-display text-4xl tracking-wider text-white uppercase">
              AVENIX <span className="text-brand-green">ADMIN</span>
            </h1>
            <p className="text-brand-textSecondary text-xs">Enter credentials to access workspace dashboard.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {authError && (
              <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-400 text-xs font-semibold rounded-lg text-center">
                {authError}
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-brand-textSecondary uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin username"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-[10px] font-bold text-brand-textSecondary uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={navigateToHome}
                className="px-4 py-2.5 rounded-lg border border-brand-green/15 text-brand-textSecondary hover:text-white text-xs font-bold transition-all min-h-[44px]"
              >
                Back to Site
              </button>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="flex-grow px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green text-black font-bold text-sm tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(242,255,88,0.3)] disabled:opacity-50 min-h-[44px]"
              >
                {isLoggingIn ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-brand-textPrimary font-body py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-green/10 pb-6 select-none">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-brand-lime animate-ping" />
              <span className="text-[10px] tracking-[0.2em] font-bold text-brand-green uppercase">Admin Workspace</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-white uppercase">
              AVENIX CORE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-lime to-brand-green text-glow-green">ADMIN</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-red-500/20 bg-brand-dark-2/40 hover:bg-red-500/10 text-red-400 font-semibold text-sm transition-all duration-300 min-h-[44px]"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button 
              onClick={navigateToHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-brand-green/20 bg-brand-dark-2/40 hover:bg-brand-lime/10 text-white font-semibold text-sm transition-all duration-300 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-brand-lime" /> View Website
            </button>
          </div>
        </div>

        {/* Alerts */}
        {alertMsg && (
          <div className={`p-4 rounded-xl border font-semibold text-sm flex items-center justify-between transition-all duration-300 ${
            alertMsg.type === 'success' 
              ? 'bg-brand-dark-green/10 border-brand-green/30 text-brand-green' 
              : 'bg-red-950/20 border-red-900/40 text-red-400'
          }`}>
            <span>{alertMsg.text}</span>
            <button onClick={() => setAlertMsg(null)} className="text-current opacity-70 hover:opacity-100 min-h-[44px] min-w-[44px] flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex flex-wrap gap-2 border-b border-brand-green/5 pb-1 select-none">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 min-h-[44px] ${
              activeTab === 'projects' 
                ? 'bg-brand-dark-2 border-t border-x border-brand-green/10 text-brand-lime' 
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <Layout className="w-4 h-4" /> Portfolio Management
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 min-h-[44px] ${
              activeTab === 'stats' 
                ? 'bg-brand-dark-2 border-t border-x border-brand-green/10 text-brand-lime' 
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Statistics
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-lg font-bold text-xs tracking-wider uppercase transition-all duration-300 min-h-[44px] ${
              activeTab === 'reviews' 
                ? 'bg-brand-dark-2 border-t border-x border-brand-green/10 text-brand-lime' 
                : 'text-brand-textMuted hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Feedback Reviews
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-brand-dark-2/20 border border-brand-green/5 rounded-2xl p-6 backdrop-blur-sm">
          
          {/* TAB 1: PORTFOLIO PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-wider font-body">Manage Projects</h2>
                  <p className="text-brand-textSecondary text-xs">Create, edit, delete, and reorder projects in the grid layout.</p>
                </div>
                <button
                  onClick={handleOpenAddForm}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-lime to-brand-green text-black font-bold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_20px_rgba(242,255,88,0.3)] min-h-[44px]"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" /> Add Project
                </button>
              </div>

              {/* Project Form Modal / Drawer */}
              {isProjectFormOpen && (
                <div className="bg-brand-dark-2/95 border border-brand-green/20 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
                  <div className="flex justify-between items-center border-b border-brand-green/10 pb-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                      {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
                    </h3>
                    <button 
                      onClick={() => setIsProjectFormOpen(false)}
                      className="p-1.5 rounded-full hover:bg-brand-dark-green/10 text-brand-textSecondary hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProject} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Avenix Mobile Portal"
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Category */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Category *</label>
                      <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value as Project['category'])}
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px] cursor-pointer"
                      >
                        <option value="Websites">Websites</option>
                        <option value="Posters">Posters</option>
                        <option value="Web Invitations">Web Invitations</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                    </div>

                    {/* Short Description */}
                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Card Summary / Short Description *</label>
                      <input
                        type="text"
                        required
                        value={projectShortDesc}
                        onChange={(e) => setProjectShortDesc(e.target.value)}
                        placeholder="A brief 1-sentence summary for the card view"
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Full Description */}
                    <div className="flex flex-col space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Full Project Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="Detailed writeup of project requirements, solutions and outcomes..."
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Thumbnail Image URL *</label>
                      <input
                        type="url"
                        required
                        value={projectThumbnail}
                        onChange={(e) => setProjectThumbnail(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Technologies (Comma Separated)</label>
                      <input
                        type="text"
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        placeholder="React, TypeScript, CSS"
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Live URL */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Live Project URL</label>
                      <input
                        type="url"
                        value={projectUrl}
                        onChange={(e) => setProjectUrl(e.target.value)}
                        placeholder="https://myproject.demo"
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Github URL */}
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">GitHub Repository URL</label>
                      <input
                        type="url"
                        value={projectGithub}
                        onChange={(e) => setProjectGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                      />
                    </div>

                    {/* Featured Checkbox & Display Order */}
                    <div className="flex items-center gap-6 md:col-span-2 py-2 select-none">
                      <button
                        type="button"
                        onClick={() => setProjectFeatured(!projectFeatured)}
                        className="flex items-center gap-2 text-xs font-bold text-brand-textSecondary uppercase tracking-wider min-h-[44px]"
                      >
                        {projectFeatured ? (
                          <ToggleRight className="w-8 h-8 text-brand-lime" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-brand-textMuted" />
                        )}
                        Featured Placement
                      </button>

                      <div className="flex items-center gap-3 ml-auto">
                        <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Sort Order</label>
                        <input
                          type="number"
                          min={1}
                          value={projectOrder}
                          onChange={(e) => setProjectOrder(parseInt(e.target.value) || 1)}
                          className="w-16 px-2.5 py-2.5 rounded-lg bg-black/60 border border-brand-green/10 text-white text-center focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 md:col-span-2 pt-4 border-t border-brand-green/10">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-brand-green text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-brand-lime min-h-[44px]"
                      >
                        {editingProject ? 'Update Project' : 'Save Project'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsProjectFormOpen(false)}
                        className="px-6 py-2.5 rounded-lg border border-brand-green/20 bg-transparent text-brand-textSecondary font-semibold text-sm hover:text-white transition-all duration-300 min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Projects List/Table */}
              <div className="overflow-x-auto border border-brand-green/10 rounded-2xl bg-black/40">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-brand-green/15 text-xs text-brand-green uppercase font-bold tracking-wider select-none bg-brand-dark-2/40">
                      <th className="py-4 px-6">Order</th>
                      <th className="py-4 px-6">Project Info</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Featured</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-green/5">
                    {projects.map((proj, idx) => (
                      <tr key={proj.slug} className="hover:bg-brand-dark-green/5 transition-colors duration-200">
                        {/* Order Operations */}
                        <td className="py-4 px-6 font-semibold select-none text-sm text-brand-lime">
                          <div className="flex items-center gap-3">
                            <span className="w-4 text-center">{proj.order}</span>
                            <div className="flex flex-col gap-1">
                              <button
                                disabled={idx === 0}
                                onClick={() => handleMoveProject(idx, 'up')}
                                className="p-0.5 text-brand-textMuted hover:text-brand-lime disabled:opacity-30 disabled:hover:text-brand-textMuted min-h-[24px] min-w-[24px]"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={idx === projects.length - 1}
                                onClick={() => handleMoveProject(idx, 'down')}
                                className="p-0.5 text-brand-textMuted hover:text-brand-lime disabled:opacity-30 disabled:hover:text-brand-textMuted min-h-[24px] min-w-[24px]"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Project Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img 
                              src={proj.thumbnail} 
                              alt="" 
                              className="w-12 h-8 rounded object-cover border border-brand-green/10" 
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{proj.title}</div>
                              <div className="text-[11px] text-brand-textSecondary truncate max-w-[250px]">
                                {proj.shortDescription}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 text-[10px] font-bold text-brand-textSecondary bg-brand-dark-1 border border-brand-green/10 rounded">
                            {proj.category}
                          </span>
                        </td>

                        {/* Featured */}
                        <td className="py-4 px-6 select-none">
                          {proj.featured ? (
                            <span className="text-[10px] font-bold text-brand-green bg-brand-dark-green/20 px-2 py-0.5 rounded border border-brand-green/30">
                              FEATURED
                            </span>
                          ) : (
                            <span className="text-[10px] text-brand-textMuted">No</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditForm(proj)}
                              className="p-2 rounded-md hover:bg-brand-lime/10 text-brand-textSecondary hover:text-brand-lime transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Edit Project"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.slug)}
                              className="p-2 rounded-md hover:bg-red-950/20 text-brand-textSecondary hover:text-red-400 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-brand-textMuted text-sm font-semibold select-none">
                          No projects available. Click "Add Project" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PORTFOLIO STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-body">Edit Statistics</h2>
                <p className="text-brand-textSecondary text-xs">These values update dynamically on the public section of the website.</p>
              </div>

              <form onSubmit={handleSaveStats} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Projects Completed */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Projects Completed *</label>
                    <input
                      type="text"
                      required
                      value={statsCompleted}
                      onChange={(e) => setStatsCompleted(e.target.value)}
                      placeholder="e.g. 20+"
                      className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                    />
                  </div>

                  {/* Happy Clients */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Happy Clients *</label>
                    <input
                      type="text"
                      required
                      value={statsClients}
                      onChange={(e) => setStatsClients(e.target.value)}
                      placeholder="e.g. 10+"
                      className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                    />
                  </div>

                  {/* Services */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Services *</label>
                    <input
                      type="text"
                      required
                      value={statsServices}
                      onChange={(e) => setStatsServices(e.target.value)}
                      placeholder="e.g. 5+"
                      className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                    />
                  </div>

                  {/* Creative Focus */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-brand-textSecondary uppercase tracking-wider">Creative Focus *</label>
                    <input
                      type="text"
                      required
                      value={statsFocus}
                      onChange={(e) => setStatsFocus(e.target.value)}
                      placeholder="e.g. 100%"
                      className="px-4 py-3 rounded-lg bg-black/60 border border-brand-green/10 text-white placeholder-brand-textMuted focus:border-brand-green/50 focus:outline-none transition-all duration-300 min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-brand-green/10">
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-brand-green hover:bg-brand-lime text-black font-bold text-sm tracking-wide transition-all duration-300 min-h-[44px]"
                  >
                    <Save className="w-4 h-4" /> Save Stats
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: FEEDBACK MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider font-body">Feedback Review Moderator</h2>
                <p className="text-brand-textSecondary text-xs">Moderation queue for user reviews. Only APPROVED reviews appear publicly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => (
                  <div 
                    key={rev.id} 
                    className="p-6 bg-black/40 border border-brand-green/10 rounded-2xl relative flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                          <span className="text-[10px] text-brand-lime font-bold uppercase">{rev.service}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          rev.status === 'approved' 
                            ? 'bg-brand-dark-green/20 border-brand-green/30 text-brand-green'
                            : rev.status === 'hidden'
                            ? 'bg-yellow-950/20 border-yellow-800/30 text-yellow-500'
                            : 'bg-orange-950/20 border-orange-900/30 text-orange-500'
                        }`}>
                          {rev.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-brand-lime space-x-0.5 select-none">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-brand-lime' : 'text-brand-textMuted'}`} 
                          />
                        ))}
                      </div>

                      <p className="text-brand-textSecondary text-xs leading-relaxed italic">
                        "{rev.message}"
                      </p>
                      
                      <div className="text-[10px] text-brand-textMuted font-bold uppercase select-none">
                        {rev.date} • {rev.email}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-brand-green/5 select-none">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleApproveReview(rev.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-brand-green/10 hover:bg-brand-green/20 border border-brand-green/20 text-brand-green text-xs font-bold transition-all duration-300 min-h-[36px]"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                      )}
                      
                      {rev.status !== 'hidden' && (
                        <button
                          onClick={() => handleHideReview(rev.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 text-yellow-500 text-xs font-bold transition-all duration-300 min-h-[36px]"
                        >
                          <EyeOff className="w-3.5 h-3.5" /> Hide
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold ml-auto transition-all duration-300 min-h-[36px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="md:col-span-2 py-12 text-center text-brand-textMuted text-sm font-semibold select-none border border-brand-green/5 bg-black/20 rounded-xl">
                    No customer feedback submissions yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
