import apiClient from "../apiClient";
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, User } from "@/types/auth";
import { Response } from "@/types/response";
import axios from "axios";

export const register = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  const res = await axios.post("https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api/auth/local/register", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/local", payload);
  return response.data; // Ambil data dari response standar
}

export async function getMe(): Promise<User> {
  const response = await apiClient.get<Response<User>>("/users/me");
  return response.data.data;
}
