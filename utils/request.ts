import axios from "axios";

const API_HOST = "https://asp-net-web-api-postgres.azurewebsites.net";

const get = (url: string) => axios.get(API_HOST + url);
const post = <T>(url: string, data?: T) => axios.post(API_HOST + url, data);
const put = <T>(url: string, data?: T) => axios.put(API_HOST + url, data);
const del = (url: string) => axios.delete(API_HOST + url);

export default {
  get,
  post,
  put,
  del,
};
