import http from 'src/infrastructure/api_client'

import { CategoryDraft } from '../model/Category'
import { UpdateCategoryArgs } from '../model/UpdateCategory'

export const API_URL = '/categories'

export async function getCategories() {
  const result = await http.get(API_URL)
  return result
}

export async function updateCategory(args: UpdateCategoryArgs) {
  const path = `${API_URL}/${args.categoryId}`
  return await http.put(path, args.payload)
}

export async function createCategory(draft: CategoryDraft) {
  return await http.post(API_URL, draft)
}