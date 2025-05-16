import axios from "axios";
import type { Car, Order } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
});

export async function fetchCars(params?: {
  search?: string;
  type?: string;
  brand?: string;
}): Promise<Car[]> {
  const res = await api.get<{ cars: Car[] }>("/cars", { params });
  return res.data.cars;
}

export async function placeOrder(order: Order): Promise<Order> {
  const res = await api.post<{ order: Order }>("/orders", order);
  return res.data.order;
}

export async function confirmOrder(vin: string): Promise<Order> {
  const res = await api.patch<{ order: Order }>(`/orders/${vin}/confirm`);
  return res.data.order;
}
