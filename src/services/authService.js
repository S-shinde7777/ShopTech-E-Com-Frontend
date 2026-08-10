import { apiFetch } from './api';

const TOKEN_KEY = 'shoptech_token';
const SESSION_KEY = 'shoptech_session';

export const authService = {
  register: async (userData) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    }

    return data.user;
  },

  login: async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
    }

    return {
      user: data.user,
      token: data.token,
    };
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentSession: () => {
    const session = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (session && token) {
      return {
        user: JSON.parse(session),
        token,
      };
    }
    return null;
  },

  verifyToken: async () => {
    try {
      const data = await apiFetch('/auth/me');
      if (data.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } catch (e) {
      authService.logout();
      return null;
    }
  },

  // ADMIN METHODS
  getUsers: async () => {
    const data = await apiFetch('/users');
    return data.users.map(u => ({ ...u, id: u._id }));
  },

  updateUserRole: async (userId, newRole) => {
    const data = await apiFetch(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
    });
    return data.user;
  },

  deleteUser: async (userId) => {
    const data = await apiFetch(`/users/${userId}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};
