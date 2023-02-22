import axios from "axios";

const api = axios.create({
  // https://vitejs.dev/guide/env-and-mode.html
  baseURL: import.meta.env.VITE_SERVER_URL,
  // gives the cookie to the server
  withCredentials: true,
});

const request = (url, options) => {
  return (
    api(url, options)
      .then((res) => res.data)
      // sometimes the error response might not have all the properties we expect, so we use optional chaining to avoid the errors
      .catch((err) => Promise.reject(err?.response?.data.message ?? "Error"))
  );
};

export default request;
