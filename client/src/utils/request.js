import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
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
