import API from "./api";

export const getResources = async (params = {}) => {
  const response = await API.get("/resources", { params });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await API.get(`/resources/${id}`);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await API.post("/resources", resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await API.put(`/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await API.delete(`/resources/${id}`);
  return response.data;
};
