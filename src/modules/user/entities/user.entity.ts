export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export interface User {
  _id?: string
  user_id?: string
  saas_name?: string
  role?: UserRole
  phone_number?: string
  password?: string
  balance?: string
  credit_line?: string,
  status?: boolean
  appId?: string
  key?: string
  white_list?: string[]
  store_list?: string[]
  test_callback?: {
    url: string,
    status: boolean
  }
  product_callback?: {
    url: string,
    status: boolean
  }
}