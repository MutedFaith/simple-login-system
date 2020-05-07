import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
});

api.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    toast.error("An unexpected error occured");
  }

  return Promise.reject(error);
});

export default {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.put,
};
