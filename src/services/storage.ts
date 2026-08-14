/* 
  Storage Service - Production Database API Integration
  
  Connects frontend components to the Node.js/Express backend APIs.
*/

export interface Project {
  title: string;
  slug: string;
  category: 'Websites' | 'Posters' | 'Web Invitations' | 'Digital Marketing';
  shortDescription: string;
  description: string;
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  projectUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
}

export interface Stats {
  completedProjects: string;
  happyClients: string;
  servicesCount: string;
  creativeFocus: string;
}

export interface FeedbackReview {
  id: string;
  name: string;
  email: string;
  service: string;
  rating: number;
  message: string;
  date: string;
  status: 'pending' | 'approved' | 'hidden';
}

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isJson = true) => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// AUTH API
export const loginAdmin = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
  }
  return data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('adminToken');
};

// PROJECTS API
export const getPortfolioProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const savePortfolioProject = async (project: Omit<Project, 'slug' | 'order'>): Promise<Project> => {
  const res = await fetch(`${API_BASE_URL}/admin/projects`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to save project');
  }
  return res.json();
};

export const updatePortfolioProject = async (slug: string, updatedData: Partial<Project>): Promise<Project> => {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${slug}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update project');
  }
  return res.json();
};

export const deletePortfolioProject = async (slug: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${slug}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete project');
  const data = await res.json();
  return data.success;
};

export const reorderProjects = async (slugs: string[]): Promise<Project[]> => {
  const res = await fetch(`${API_BASE_URL}/admin/projects/reorder`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ slugs })
  });
  if (!res.ok) throw new Error('Failed to reorder projects');
  return res.json();
};

// STATS API
export const getPortfolioStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const savePortfolioStats = async (stats: Stats): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(stats)
  });
  if (!res.ok) throw new Error('Failed to save stats');
};

// REVIEWS API
export const getReviews = async (): Promise<FeedbackReview[]> => {
  const endpoint = isLoggedIn() ? `${API_BASE_URL}/admin/reviews` : `${API_BASE_URL}/reviews`;
  const res = await fetch(endpoint, {
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
};

export const submitReview = async (review: Omit<FeedbackReview, 'id' | 'date' | 'status'>): Promise<FeedbackReview> => {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (!res.ok) throw new Error('Failed to submit review');
  const data = await res.json();
  return data.review;
};

export const approveReview = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/approve`, {
    method: 'PUT',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to approve review');
  return true;
};

export const hideReview = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}/hide`, {
    method: 'PUT',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to hide review');
  return true;
};

export const deleteReview = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/admin/reviews/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error('Failed to delete review');
  const data = await res.json();
  return data.success;
};

// IMAGE UPLOAD API
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: 'POST',
    headers: getHeaders(false),
    body: formData
  });
  
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Image upload failed');
  }
  
  const data = await res.json();
  return data.url;
};

// CONTACT INQUIRY API
export const submitContactInquiry = async (inquiry: {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}) => {
  try {
    await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
  } catch (error) {
    console.error('Failed to log contact inquiry to database:', error);
  }
};
