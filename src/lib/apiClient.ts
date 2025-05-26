import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Tambahkan interceptor untuk menyisipkan Bearer Token
apiClient.interceptors.request.use((config) => {
  const token =
    typeof document !== "undefined"
      ? document.cookie
          .split(";")
          .find((c) => c.trim().startsWith("token="))
          ?.split("=")[1]
      : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
