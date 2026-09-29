import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 30000,
  withCredentials: true,
});

export default {
  async register(email, password) {
    const res = await api.post('/auth/register', { email, password });
    return res.data;
  },

  async login(identifier, password) {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data;
  },

  async googleLogin(credential) {
    const res = await api.post('/auth/google', { credential });
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async startChat() {
    const res = await api.post('/chat/start', {});
    return res.data;
  },

  async sendMessage(sessionId, message, file = null) {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (file) formData.append('file', file);

    const res = await api.post(`/chat/message/${sessionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getSession(sessionId) {
    const res = await api.get(`/chat/session/${sessionId}`);
    return res.data;
  },

  async resetSession(sessionId) {
    const res = await api.post(`/chat/session/${sessionId}/reset`);
    return res.data;
  },

  async getScholarships(filters = {}) {
    const params = new URLSearchParams();
    if (filters.state) params.append('state', filters.state);
    if (filters.category) params.append('category', filters.category);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.level) params.append('level', filters.level);
    const res = await api.get(`/scholarships?${params.toString()}`);
    return res.data;
  },

  async getScholarship(id) {
    const res = await api.get(`/scholarships/${id}`);
    return res.data;
  },

  async getApplications() {
    const res = await api.get('/applications/me');
    return res.data;
  },

  async submitApplication(schemeId) {
    const res = await api.post(`/applications/${schemeId}/submit`);
    return res.data;
  },

  async getAdminApplications() {
    const res = await api.get('/admin/applications');
    return res.data.applications;
  },

  async verifyDocument(docId, notes = '') {
    const res = await api.post(`/admin/documents/${docId}/verify`, { notes });
    return res.data;
  },

  async updateApplicationStatus(applicationId, status, rejectionReason = null) {
    const res = await api.patch(`/admin/applications/${applicationId}`, {
      status,
      rejection_reason: rejectionReason,
    });
    return res.data;
  }
};
