import axios from "axios";
export const axiosStocksInstance = axios.create({
  baseURL: "https://financialmodelingprep.com/api/",
});
