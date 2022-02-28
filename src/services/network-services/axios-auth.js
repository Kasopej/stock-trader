import axios from "axios";
export const axiosAuthInstance = axios.create({
  baseURL: "https://identitytoolkit.googleapis.com/v1/",
});
