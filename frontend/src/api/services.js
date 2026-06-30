import apiClient from "./client";

/**
 * =====================================
 * Generic API Service
 * =====================================
 */

// GET Request
export const getRequest = async (url, params = {}) => {
  const response = await apiClient.get(url, { params });
  return response.data;
};

// POST Request
export const postRequest = async (url, data = {}) => {
  const response = await apiClient.post(url, data);
  return response.data;
};

// PUT Request
export const putRequest = async (url, data = {}) => {
  const response = await apiClient.put(url, data);
  return response.data;
};

// PATCH Request
export const patchRequest = async (url, data = {}) => {
  const response = await apiClient.patch(url, data);
  return response.data;
};

// DELETE Request
export const deleteRequest = async (url) => {
  const response = await apiClient.delete(url);
  return response.data;
};

// File Upload
export const uploadFile = async (url, formData) => {
  const response = await apiClient.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// File Download
export const downloadFile = async (url) => {
  const response = await apiClient.get(url, {
    responseType: "blob",
  });

  return response.data;
};