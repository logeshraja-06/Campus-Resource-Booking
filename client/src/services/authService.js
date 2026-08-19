import API from "./api";

export const login = async (email, password) => {
  const response = await API.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (fullName, email, password, role, department, year) => {
  const response = await API.post("/auth/register", {
    fullName,
    email,
    password,
    role,
    department,
    year: year ? Number(year) : null,
  });
  return response.data;
};
