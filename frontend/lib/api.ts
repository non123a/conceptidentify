import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

export default api;
// import axios from "axios";

// let isRedirecting = false;

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,

//   (error) => {

//     if (
//       error.response?.status === 401 &&
//       !isRedirecting
//     ) {

//       isRedirecting = true;

//       window.location.href = "/login";
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;