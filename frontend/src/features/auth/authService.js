import axios from "axios";

const API_URL = "/api/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + "register", userData);
  return response.data;
};

// Confirm Email
const confirmEmail = async (email, token) => {
  const { data } = await axios.get(`${API_URL}confirmation/${email}/${token}`);
  return data;
};

// forgot password
const forgotPassword = async (email) => {
  const { data } = await axios.post(`${API_URL}password/forgot`, email);
  return data;
};

// reset password
const resetPassword = async (passwords) => {
  const { data } = await axios.post(
    `${API_URL}password/reset/${passwords.token}`,
    passwords
  );
  return data;
};

// Login user
const login = async (userData) => {
  const { data } = await axios.post(API_URL + "login", userData);

  if (data) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
  console.log(data);
  return data;
};

// Resend Link
const resendLink = async (email) => {
  const { data } = await axios.post(`/api/users/resend`, { email });
  return data;
};

// Change  Email
const changePassword = async (userData) => {
  const { data } = await axios.post(`/api/users/me/change-email`, userData);

  return data;
};

// logout
const logout = async () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  confirmEmail,
  resendLink,
  resetPassword,
  forgotPassword,
  login,
  logout,
  changePassword,
};

export default authService;
