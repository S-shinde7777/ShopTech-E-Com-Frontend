const BASE_URL = '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('shoptech_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // If 401 Unauthorized, token might be expired
      if (response.status === 401 && token) {
        localStorage.removeItem('shoptech_token');
        localStorage.removeItem('shoptech_session');
      }
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};
