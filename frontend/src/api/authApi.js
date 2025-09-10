import axios from 'axios';

const API_URL = '/api/auth/'; // Proxied to http://localhost:5000/api/auth

const register = (userData) => {
  return axios.post(API_URL + 'register', userData);
};

const login = (userData) => {
  return axios.post(API_URL + 'login', userData);
};

export default {
  register,
  login,
};
