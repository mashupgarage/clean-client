import axios, { AxiosInstance } from "axios";
// import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

const API_BASE_URL = BASE_URL;

// const useAxiosWithInterceptor = (): AxiosInstance => {
//   const jwtAxios = axios.create({ baseURL: API_BASE_URL });
//   const navigate = useNavigate();

//   // Response Interceptor to handle and log errors
//   jwtAxios.interceptors.response.use(
//     (response) => {
//       return response;
//     },

//     // Intercept 403 responses and redirect to another page
//     async (error) => {
//       const originalRequest = error.config; // Get original request

//       if (error.response?.status === 403) {
//         const goRoot = () => navigate("/test"); // Redirect to test page
//         goRoot();
//       }
//       throw error; // Throw error to catch block
//     }
//   );
//   return jwtAxios;
// };

const axiosWithInterceptor = (): AxiosInstance => {
  const jwtAxios = axios.create({ baseURL: API_BASE_URL });

  // Response Interceptor to handle and log errors
  jwtAxios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        // Handle 403 errors if needed
        console.error("Redirect due to 403 Forbidden");
      }
      throw error;
    },
  );
  return jwtAxios;
};

// export default useAxiosWithInterceptor;
export default axiosWithInterceptor;
