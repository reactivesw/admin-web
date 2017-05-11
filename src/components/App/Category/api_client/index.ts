import http from 'src/infrastructure/api_client'

export const API_URL = '/categories'

export async function getCategories() {
  const result = await http.get(API_URL)
  return result
}