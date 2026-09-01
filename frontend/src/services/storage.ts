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

const API_URL = import.meta.env.VITE_API_URL || 'https://avenix-core-project.onrender.com';
const API_BASE_URL = `${API_URL}/api`;

// Check if a JWT token is expired on the client side
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    if (!decoded || typeof decoded.exp !== 'number') return false;
    // Exp is in seconds; check with 10s buffer
    return Date.now() >= (decoded.exp * 1000) - 10000;
  } catch {
    return true;
  }
};

// Centralized logout and event dispatcher
export const logoutAdmin = (reason: 'manual' | 'expired' | 'invalid' = 'manual') => {
  const hadToken = !!localStorage.getItem('adminToken');
  localStorage.removeItem('adminToken');
  if (hadToken && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('admin-auth-changed', {
      detail: { isAuth: false, reason }
    }));
  }
};

// Check if admin is currently logged in with a non-expired token
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  if (isTokenExpired(token)) {
    logoutAdmin('expired');
    return false;
  }
  return true;
};

// Authenticated fetch wrapper with automatic 401/403 session expiration handling
const authFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('adminToken');
  
  if (!token || isTokenExpired(token)) {
    logoutAdmin('expired');
    throw new Error('Your session has expired. Please log in again.');
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`,
    ...(options.headers as Record<string, string> || {})
  };

  // Only add Content-Type: application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    let message = 'Session expired or invalid. Please log in again.';
    try {
      const errData = await response.clone().json();
      if (errData?.message) message = errData.message;
    } catch {
      // ignore json parse error
    }
    logoutAdmin('expired');
    throw new Error(message);
  }

  return response;
};

// AUTH API
export const loginAdmin = async (username: string, password: string) => {
  const res = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  const data = await res.json();
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('admin-auth-changed', {
        detail: { isAuth: true, admin: data.admin }
      }));
    }
  }
  return data;
};

// Verify active session with backend
export const verifyAdminSession = async (): Promise<boolean> => {
  if (!isLoggedIn()) return false;
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) return false;

    const res = await fetch(`${API_BASE_URL}/admin/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401 || res.status === 403) {
      logoutAdmin('expired');
      return false;
    }

    // If backend hasn't redeployed verify route yet (404), fall back to client-side validity
    if (res.status === 404) {
      return isLoggedIn();
    }

    if (!res.ok) {
      return false;
    }

    const data = await res.json().catch(() => ({}));
    return !!data.valid;
  } catch {
    // If backend network error, rely on non-expired local token
    return isLoggedIn();
  }
};


// PROJECTS API (Public & Admin)
export const getPortfolioProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
};

export const savePortfolioProject = async (project: Omit<Project, 'slug' | 'order'>): Promise<Project> => {
  const res = await authFetch('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(project)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to save project');
  }
  return res.json();
};

export const updatePortfolioProject = async (slug: string, updatedData: Partial<Project>): Promise<Project> => {
  const res = await authFetch(`/admin/projects/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update project');
  }
  return res.json();
};

export const deletePortfolioProject = async (slug: string): Promise<boolean> => {
  const res = await authFetch(`/admin/projects/${slug}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete project');
  const data = await res.json();
  return data.success;
};

export const reorderProjects = async (slugs: string[]): Promise<Project[]> => {
  const res = await authFetch('/admin/projects/reorder', {
    method: 'PUT',
    body: JSON.stringify({ slugs })
  });
  if (!res.ok) throw new Error('Failed to reorder projects');
  return res.json();
};

// STATS API (Public & Admin)
export const getPortfolioStats = async (): Promise<Stats> => {
  const res = await fetch(`${API_BASE_URL}/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const savePortfolioStats = async (stats: Stats): Promise<void> => {
  const res = await authFetch('/admin/stats', {
    method: 'PUT',
    body: JSON.stringify(stats)
  });
  if (!res.ok) throw new Error('Failed to save stats');
};

// REVIEWS API
// Public reviews (approved only)
export const getPublicReviews = async (): Promise<FeedbackReview[]> => {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
};

// Backward-compatibility alias for public review display
export const getReviews = getPublicReviews;

// Admin reviews (all statuses: pending, approved, hidden)
export const getAdminReviews = async (): Promise<FeedbackReview[]> => {
  const res = await authFetch('/admin/reviews', {
    method: 'GET'
  });
  if (!res.ok) throw new Error('Failed to fetch admin reviews');
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
  const res = await authFetch(`/admin/reviews/${id}/approve`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Failed to approve review');
  return true;
};

export const hideReview = async (id: string): Promise<boolean> => {
  const res = await authFetch(`/admin/reviews/${id}/hide`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Failed to hide review');
  return true;
};

export const deleteReview = async (id: string): Promise<boolean> => {
  const res = await authFetch(`/admin/reviews/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete review');
  const data = await res.json();
  return data.success;
};

// IMAGE UPLOAD API
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await authFetch('/admin/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
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

