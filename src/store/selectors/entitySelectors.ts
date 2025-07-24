// src/store/entitySelectors.ts
import { createSelector } from '@reduxjs/toolkit'
import type { Order, Product, RootState, User } from '../store'

// Mock data selectors (to be replaced with actual state when implemented)
// These would normally select from Redux state slices

// Product selectors
export const selectAllProducts = (state: RootState) => {
  // TODO: Replace with actual state selection when products slice is implemented
  // return state.products.items
  return [] as Product[]
}

export const selectProductsLoading = (state: RootState) => {
  // return state.products.loading
  return false
}

export const selectProductById = (productId: string) =>
  createSelector([selectAllProducts], (products) =>
    products.find((product) => product.id === productId)
  )

export const selectFavoriteProducts = createSelector([selectAllProducts], (products) =>
  products.filter((product) => product.favourite)
)

export const selectProductsByBrand = (brand: string) =>
  createSelector([selectAllProducts], (products) =>
    products.filter((product) => product.brand === brand)
  )

export const selectProductsInStock = createSelector([selectAllProducts], (products) =>
  products.filter((product) => product.stock > 0)
)

export const selectProductStats = createSelector([selectAllProducts], (products) => ({
  total: products.length,
  inStock: products.filter((p) => p.stock > 0).length,
  outOfStock: products.filter((p) => p.stock === 0).length,
  favorites: products.filter((p) => p.favourite).length,
  averagePrice:
    products.length > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length
      : 0,
}))

// Order selectors
export const selectAllOrders = (state: RootState) => {
  // TODO: Replace with actual state selection when orders slice is implemented
  // return state.orders.items
  return [] as Order[]
}

export const selectOrdersLoading = (state: RootState) => {
  // return state.orders.loading
  return false
}

export const selectOrderById = (orderId: string) =>
  createSelector([selectAllOrders], (orders) =>
    orders.find((order) => order.id === orderId)
  )

export const selectOrdersByStatus = (status: Order['status']) =>
  createSelector([selectAllOrders], (orders) =>
    orders.filter((order) => order.status === status)
  )

export const selectOrdersByUser = (userId: string) =>
  createSelector([selectAllOrders], (orders) =>
    orders.filter((order) => order.userId === userId)
  )

export const selectOrderStats = createSelector([selectAllOrders], (orders) => ({
  total: orders.length,
  pending: orders.filter((o) => o.status === 'pending').length,
  inProgress: orders.filter((o) => o.status === 'in progress').length,
  completed: orders.filter((o) => o.status === 'success').length,
  cancelled: orders.filter((o) => o.status === 'cancelled').length,
  totalRevenue: orders
    .filter((o) => o.status === 'success')
    .reduce((sum, o) => sum + o.total, 0),
}))

// User selectors (for admin)
export const selectAllUsers = (state: RootState) => {
  // TODO: Replace with actual state selection when users slice is implemented
  // return state.users.items
  return [] as User[]
}

export const selectUsersLoading = (state: RootState) => {
  // return state.users.loading
  return false
}

export const selectUserById = (userId: string) =>
  createSelector([selectAllUsers], (users) => users.find((user) => user.id === userId))

export const selectActiveUsers = createSelector([selectAllUsers], (users) =>
  users.filter((user) => user.active)
)

export const selectUserStats = createSelector([selectAllUsers], (users) => ({
  total: users.length,
  active: users.filter((u) => u.active).length,
  inactive: users.filter((u) => !u.active).length,
}))

// Combined selectors for dashboard
export const selectDashboardStats = createSelector(
  [selectProductStats, selectOrderStats, selectUserStats],
  (productStats, orderStats, userStats) => ({
    products: productStats,
    orders: orderStats,
    users: userStats,
  })
)

// Selector for order details with user and product info
export const selectEnrichedOrders = createSelector(
  [selectAllOrders, selectAllUsers, selectAllProducts],
  (orders, users, products) =>
    orders.map((order) => {
      const user = users.find((u) => u.id === order.userId)
      const enrichedItems = order.items.map((item) => {
        const product = products.find((p) => p.id === item.productId)
        return {
          ...item,
          product,
        }
      })
      return {
        ...order,
        user,
        items: enrichedItems,
      }
    })
)

// Search selectors
export const createProductSearchSelector = (searchTerm: string) =>
  createSelector([selectAllProducts], (products) => {
    const term = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.brand.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    )
  })

export const createUserSearchSelector = (searchTerm: string) =>
  createSelector([selectAllUsers], (users) => {
    const term = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    )
  })
