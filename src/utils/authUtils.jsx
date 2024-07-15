// authUtils.js
import axios from "axios";

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

export const fetchWithToken = async (url, options = {}) => {
  let token = getAuthToken();
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  if (Date.now() >= tokenExpiry && !isRefreshing) {
    isRefreshing = true;
    try {
      const refreshResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, { token });
      if (refreshResponse.status === 200) {
        const { token: newToken, expires_in } = refreshResponse.data;
        token = newToken;
        const newTokenExpiry = Date.now() + expires_in * 1000;
        setAuthToken(newToken);
        localStorage.setItem("tokenExpiry", newTokenExpiry);
        processQueue(null, newToken);
      } else {
        processQueue(new Error('Failed to refresh token'));
      }
    } catch (error) {
      processQueue(error, null);
      removeAuthToken();
      window.location.href = '/login'; // Redirect to login page
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(token => {
      options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
      };
      return axios(url, options);
    }).catch(error => {
      throw error;
    });
  }

  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  return axios(url, options);
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

