import axios from "axios";
export const axiosAccountInstance = axios.create({
  baseURL:
    "https://personalstocktrader-7717a-default-rtdb.europe-west1.firebasedatabase.app/",
});
