import axios from 'axios';

const API_URL = '/api/admin/';

// Get dashboard statistics
const getStats = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(API_URL + 'stats', config);
};

// Get all users
const getAllUsers = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(API_URL + 'users', config);
};

// Get all files
const getAllFiles = (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(API_URL + 'files', config);
};

const adminApiService = {
  getStats,
  getAllUsers,
  getAllFiles,
};

export default adminApiService;