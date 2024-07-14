import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FormGenerator from './pages/formGenerator';
import ResultGenerator from './pages/ResultGenerator';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import ContactAdminPage from './pages/contactPageAdmin';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/form-generator" element={<FormGenerator />} />
          <Route path="/form-result" element={<ResultGenerator />} />
          <Route path="/form-result/:magicLink" element={<ResultGenerator />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/forgot-pin" element={<ContactAdminPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;