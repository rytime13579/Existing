import axios from "axios";


export const axiosInstance = axios.create({
    // define route for api in dev or producion
    baseURL: import.meta.env.MODE == "development" ? "http://localhost:3000/api" : "/api",
    // ensure that cookies are enabled
    withCredentials: true,
})