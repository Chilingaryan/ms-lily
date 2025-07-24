import { configureStore, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
  },
})

export const { increment } = counterSlice.actions

export interface Product {
  id: string
  name: string
  brand: string
  sizes: number[]
  price: number
  stock: number
  image: string
  description: string
  favourite: boolean
}

const productsSlice = createSlice<Product[]>({
  name: 'products',
  initialState: [] as Product[],
  reducers: {
    addProduct: {
      reducer: (state: Product[], action: PayloadAction<Product>) => {
        state.push(action.payload)
      },
      prepare: (product: Omit<Product, 'id' | 'favourite'>) => ({
        payload: { ...product, favourite: false, id: nanoid() },
      }),
    },
    updateProduct: (state: Product[], action: PayloadAction<Product>) => {
      const idx = state.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state[idx] = action.payload
    },
    deleteProduct: (state: Product[], action: PayloadAction<string>) => {
      return state.filter((p) => p.id !== action.payload)
    },
    toggleFavourite: (state: Product[], action: PayloadAction<string>) => {
      const prod = state.find((p) => p.id === action.payload)
      if (prod) prod.favourite = !prod.favourite
    },
  },
})

export const { addProduct, updateProduct, deleteProduct, toggleFavourite } =
  productsSlice.actions

export interface User {
  id: string
  name: string
  email: string
  active: boolean
}

const usersSlice = createSlice<User[]>({
  name: 'users',
  initialState: [] as User[],
  reducers: {
    addUser: {
      reducer: (state: User[], action: PayloadAction<User>) => {
        state.push(action.payload)
      },
      prepare: (user: Omit<User, 'id' | 'active'>) => ({
        payload: { ...user, active: true, id: nanoid() },
      }),
    },
    updateUser: (state: User[], action: PayloadAction<User>) => {
      const idx = state.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) state[idx] = action.payload
    },
    deleteUser: (state: User[], action: PayloadAction<string>) => {
      return state.filter((u) => u.id !== action.payload)
    },
    toggleActive: (state: User[], action: PayloadAction<string>) => {
      const user = state.find((u) => u.id === action.payload)
      if (user) user.active = !user.active
    },
  },
})

export const { addUser, updateUser, deleteUser, toggleActive } = usersSlice.actions

export interface Order {
  id: string
  userId: string
  items: { productId: string; quantity: number }[]
  total: number
  status: 'in progress' | 'closed' | 'success'
}

const ordersSlice = createSlice<Order[]>({
  name: 'orders',
  initialState: [] as Order[],
  reducers: {
    addOrder: {
      reducer: (state: Order[], action: PayloadAction<Order>) => {
        state.push(action.payload)
      },
      prepare: (order: Omit<Order, 'id'>) => ({
        payload: { ...order, id: nanoid() },
      }),
    },
    updateStatus: (
      state: Order[],
      action: PayloadAction<{ id: string; status: Order['status'] }>
    ) => {
      const order = state.find((o) => o.id === action.payload.id)
      if (order) order.status = action.payload.status
    },
  },
})

export const { addOrder, updateStatus } = ordersSlice.actions

export interface Profile {
  name: string
  email: string
  password: string
}

const profileSlice = createSlice<Profile>({
  name: 'profile',
  initialState: { name: 'Admin', email: 'admin@example.com', password: '' } as Profile,
  reducers: {
    updateProfile: (_state: Profile, action: PayloadAction<Profile>) =>
      action.payload,
  },
})

export const { updateProfile } = profileSlice.actions

export interface AuthState {
  loggedIn: boolean
}

const authSlice = createSlice({
  name: 'auth',
  // start the app logged out so the login flow can be tested
  initialState: { loggedIn: false } as AuthState,
  reducers: {
    login: (state) => {
      state.loggedIn = true
    },
    logout: (state) => {
      state.loggedIn = false
    },
  },
})

export const { login, logout } = authSlice.actions

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    products: productsSlice.reducer,
    users: usersSlice.reducer,
    orders: ordersSlice.reducer,
    profile: profileSlice.reducer,
    auth: authSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
