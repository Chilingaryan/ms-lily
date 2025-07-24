import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Product, User, Order } from '../store/store'

const users: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', active: true },
  { id: '2', name: 'Bob', email: 'bob@example.com', active: true },
]

const products: Product[] = [
  {
    id: '1',
    name: 'Sneaker A',
    brand: 'BrandX',
    sizes: [7,8,9],
    price: 120,
    stock: 10,
    image: '',
    description: 'Lightweight running shoe',
    favourite: true,
  },
  {
    id: '2',
    name: 'Sneaker B',
    brand: 'BrandY',
    sizes: [8,9,10],
    price: 150,
    stock: 5,
    image: '',
    description: 'High-top sneaker',
    favourite: false,
  },
]

const orders: Order[] = [
  {
    id: '1',
    userId: '1',
    items: [{ productId: '1', quantity: 2 }],
    total: 240,
    status: 'in progress',
  },
  {
    id: '2',
    userId: '2',
    items: [{ productId: '2', quantity: 1 }],
    total: 150,
    status: 'success',
  },
]

const adapter = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  if (config.method === 'get') {
    switch (config.url) {
      case '/users':
        return { data: users, status: 200, statusText: 'OK', headers: {}, config }
      case '/products':
        return { data: products, status: 200, statusText: 'OK', headers: {}, config }
      case '/orders':
        return { data: orders, status: 200, statusText: 'OK', headers: {}, config }
      default:
        return { data: null, status: 404, statusText: 'Not Found', headers: {}, config }
    }
  }
  return { data: null, status: 404, statusText: 'Not Found', headers: {}, config }
}

export const api = axios.create({ adapter })

export { users, products, orders }
