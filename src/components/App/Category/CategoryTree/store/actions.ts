import { SET_CATEGORIES } from './mutations'
import { getCategories } from '../api_client'

export const FETCH_CATEGORIES = 'categoryTree/FETCH_CATEGORIES'

const actions = {
  async[FETCH_CATEGORIES]({ commit }) {
    const data = await getCategories()
    commit(SET_CATEGORIES, data)
  }
}

export default actions
