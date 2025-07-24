// src/store/dataSelectors.ts - Additional selectors for application data
import { createSelector } from '@reduxjs/toolkit'
import type { Order, Product, User } from '../store'

// If you extend your store to include data slices in the future, these selectors will be ready
// For now, they can be used with component-level state or extended when you add data to Redux

// Mock data selectors (to be replaced when data is moved to Redux)
// Mock data selectors (to be replaced when data is moved to Redux)
export const createProductSelectors = (products: Product[]) => {
  const selectProducts = () => products

  return {
    selectFavoriteProducts: createSelector(selectProducts, (products) =>
      products.filter((p) => p.favourite)
    ),

    selectProductsByBrand: (brand: string) =>
      createSelector(selectProducts, (products) =>
        products.filter((p) => p.brand === brand)
      ),

    selectProductsInStock: createSelector(selectProducts, (products) =>
      products.filter((p) => p.stock > 0)
    ),

    selectProductStats: createSelector(selectProducts, (products) => ({
      total: products.length,
      inStock: products.filter((p) => p.stock > 0).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      favorites: products.filter((p) => p.favourite).length,
      averagePrice:
        products.length > 0
          ? products.reduce((sum, p) => sum + p.price, 0) / products.length
          : 0,
    })),
  }
}

export const createOrderSelectors = (orders: Order[]) => {
  const selectOrders = () => orders

  return {
    selectOrdersByStatus: (status: string) =>
      createSelector(selectOrders, (orders) => orders.filter((o) => o.status === status)),

    selectPendingOrders: createSelector(selectOrders, (orders) =>
      orders.filter((o) => o.status === 'pending')
    ),

    selectInProgressOrders: createSelector(selectOrders, (orders) =>
      orders.filter((o) => o.status === 'in progress')
    ),

    selectCompletedOrders: createSelector(selectOrders, (orders) =>
      orders.filter((o) => o.status === 'success')
    ),

    selectOrderStats: createSelector(selectOrders, (orders) => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      inProgress: orders.filter((o) => o.status === 'in progress').length,
      completed: orders.filter((o) => o.status === 'success').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter((o) => o.status === 'success')
        .reduce((sum, o) => sum + o.total, 0),
    })),
  }
}

export const createUserSelectors = (users: User[]) => {
  const selectUsers = () => users

  return {
    selectActiveUsers: createSelector(selectUsers, (users) =>
      users.filter((u) => u.active)
    ),

    selectInactiveUsers: createSelector(selectUsers, (users) =>
      users.filter((u) => !u.active)
    ),

    selectUserStats: createSelector(selectUsers, (users) => ({
      total: users.length,
      active: users.filter((u) => u.active).length,
      inactive: users.filter((u) => !u.active).length,
    })),
  }
}

// Dashboard aggregation selector
export const createDashboardSelectors = (
  users: User[],
  orders: Order[],
  products: Product[]
) => {
  const selectUsers = () => users
  const selectOrders = () => orders
  const selectProducts = () => products

  return {
    selectDashboardStats: createSelector(
      [selectUsers, selectOrders, selectProducts],
      (users, orders, products) => ({
        users: {
          total: users.length,
          active: users.filter((u) => u.active).length,
        },
        orders: {
          total: orders.length,
          pending: orders.filter((o) => o.status === 'pending').length,
          inProgress: orders.filter((o) => o.status === 'in progress').length,
          completed: orders.filter((o) => o.status === 'success').length,
          totalRevenue: orders
            .filter((o) => o.status === 'success')
            .reduce((sum, o) => sum + o.total, 0),
        },
        products: {
          total: products.length,
          favorites: products.filter((p) => p.favourite).length,
          inStock: products.filter((p) => p.stock > 0).length,
          outOfStock: products.filter((p) => p.stock === 0).length,
        },
      })
    ),
  }
}

// Utility function to create memoized data transformations
export const createDataTransformSelector = <T, R>(
  dataGetter: () => T[],
  transformer: (data: T[]) => R
) => createSelector(dataGetter, transformer)

// Search and filter selectors
export const createSearchSelector = <T>(
  dataGetter: () => T[],
  searchFields: (keyof T)[]
) =>
  createSelector(
    [dataGetter, (_: any, searchTerm: string) => searchTerm.toLowerCase()],
    (data, searchTerm) => {
      if (!searchTerm) return data

      return data.filter((item) =>
        searchFields.some((field) => {
          const value = item[field]
          return (
            value && typeof value === 'string' && value.toLowerCase().includes(searchTerm)
          )
        })
      )
    }
  )

// Pagination selector
export const createPaginationSelector = <T>(dataGetter: () => T[]) =>
  createSelector(
    [
      dataGetter,
      (_: any, page: number) => page,
      (_: any, __: number, pageSize: number) => pageSize,
    ],
    (data, page, pageSize) => {
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize

      return {
        data: data.slice(startIndex, endIndex),
        total: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
      }
    }
  )

// Sorting selector
export const createSortSelector = <T>(dataGetter: () => T[]) =>
  createSelector(
    [
      dataGetter,
      (_: any, sortField: keyof T) => sortField,
      (_: any, __: keyof T, sortOrder: 'asc' | 'desc') => sortOrder,
    ],
    (data, sortField, sortOrder) => {
      return [...data].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }
  )
