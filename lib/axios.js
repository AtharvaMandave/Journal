import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const fetcher = (url) => api.get(url).then((res) => res.data);