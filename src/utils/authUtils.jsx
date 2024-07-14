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

  if (Date.now() >= tokenExpiry) {
    // Token expired, refresh it
    try {
      const refreshResponse = await axios.post("/api/auth/refresh-token", {
        token,
      });

      if (refreshResponse.status === 200) {
        const { token: newToken, expires_in } = refreshResponse.data;
        token = newToken;
        const newTokenExpiry = Date.now() + expires_in * 1000;
        setAuthToken(newToken);
        localStorage.setItem("tokenExpiry", newTokenExpiry);
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      removeAuthToken();
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  return axios(url, options);
};