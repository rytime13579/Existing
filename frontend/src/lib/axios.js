import axios from "axios";


// essettailly this just creates an axios instacne that allows us to make api
// requests from our interanl server

export const axiosInstance = axios.create({
    // define route for api in dev or producion
    baseURL: import.meta.env.MODE == "development" ? "http://localhost:3000/api" : "/api",
    // ensure that cookies are enabled
    withCredentials: true,
})