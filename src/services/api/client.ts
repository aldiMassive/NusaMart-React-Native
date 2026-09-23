import { create } from 'axios'

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  timeout: 10_000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
})
