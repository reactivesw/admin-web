import http from 'src/infrastructure/api_client'

import { UpdateCategoryArgs } from '../model/UpdateCategory'

export const API_URL = '/categories'

export async function getCategories() {
  const result = await http.get(API_URL)
  return result
}

export async function setOrderHint(args: UpdateCategoryArgs) {
  const path = `${API_URL}/${args.categoryId}`
  const result = await http.put(path, args.payload)
  return result
}