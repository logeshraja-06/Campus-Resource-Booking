import API from "./api";

export const createBooking = async (bookingData) => {
  const response = await API.post("/bookings", bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await API.get("/bookings/my-bookings");
  return response.data;
};

export const getAllBookings = async () => {
  const response = await API.get("/bookings");
  return response.data;
};

export const approveBooking = async (id) => {
  const response = await API.put(`/bookings/${id}/approve`);
  return response.data;
};

export const rejectBooking = async (id, reason) => {
  const response = await API.put(`/bookings/${id}/reject`, { reason });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await API.put(`/bookings/${id}/cancel`);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await API.get("/bookings/stats");
  return response.data;
};
