import CategoryNode from '../model/CategoryNode'
import { CategoryView, DummyCategoryView } from '../model/Category'

export const SET_CATEGORY_TREE = 'category/SET_CATEGORY_TREE'
export const SET_ORDER_HINT = 'category/SET_ORDER_HINT'
export const SET_DISABLE_SELECTS = 'category/SET_DISABLE_SELECTS'

const mutations = {
  [SET_CATEGORY_TREE](state, categories) {
    buildCategoryTree(state, categories)
  },

  [SET_ORDER_HINT](state, category: CategoryView) {
    state.categoryMap[category.id] = category
  },

  [SET_DISABLE_SELECTS](state, flag) {
    state.disableSelects = flag
  }
}

export default mutations

function buildCategoryTree(state, categories: CategoryView[]) {
  // local data
  const virtualRoot: CategoryNode = new CategoryNode(DummyCategoryView)
  const categoryMap = {}

  categories.sort((c1, c2) => {
    return parseFloat(c1.orderHint) - parseFloat(c2.orderHint)
  })

  //  add root categories
  for (let cat of categories) {
    categoryMap[cat.id] = cat
    if (!cat.parent) {
      virtualRoot.addChild(cat.id)
    }
  }

  state.categories = categories
  state.categoryTree =  virtualRoot
  state.categoryMap = categoryMap
}
