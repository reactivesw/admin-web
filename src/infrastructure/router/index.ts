import Vue from 'vue'
import VueRouter from 'vue-router'

import Category from 'src/components/App/Category'
import Customer from 'src/components/App/Customer'
import Order from 'src/components/App/Order'
import Product from 'src/components/App/Product'
import ProductType from 'src/components/App/ProductType'

Vue.use(VueRouter)

const routes = [
  // map '/categories' to Category to dismiss vue-router warning
  {
    name: 'home',
    path: '/',
    redirect: '/categories'
  },
  {
    name: 'categories',
    path: '/categories',
    component: Category
  },
  {
    name: 'customers',
    path: '/customers',
    component: Customer
  },
  {
    name: 'orders',
    path: '/orders',
    component: Order
  },
  {
    name: 'products',
    path: '/products',
    component: Product
  },
  {
    name: 'product-types',
    path: '/product-types',
    component: ProductType
  },
  {
    path: '*',
    redirect: {
      name: 'categories'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
