import axios from 'axios';

const API_URL = '/api/files/';

/**
 * Uploads a file.
 * @param {FormData} formData - The form data containing the file.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} Axios promise object.
 */
const uploadFile = (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
    },
  };
  return axios.post(API_URL + 'upload', formData, config);
};

/**
 * Fetches the upload history for the logged-in user.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} Axios promise object.
 */
const getHistory = (token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  return axios.get(API_URL + 'history', config);
};

/**
 * Deletes a specific file.
 * @param {string} fileId - The ID of the file to delete.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} Axios promise object.
 */
const deleteFile = (fileId, token) => {
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
  return axios.delete(API_URL + fileId, config);
};

const fileApiService = {
  uploadFile,
  getHistory,
  deleteFile,
};

export default fileApiService;