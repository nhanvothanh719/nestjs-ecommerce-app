export const OrderBy = {
  Asc: 'asc',
  Desc: 'desc',
} as const

export const ProductSortField = {
  Price: 'price',
  CreatedAt: 'createdAt',
  Sale: 'sale',
} as const

export type OrderByType = (typeof OrderBy)[keyof typeof OrderBy]
export type ProductSortFieldType = (typeof ProductSortField)[keyof typeof ProductSortField]

// Websocket constants
export const USE_SOCKET_ROOM = true
export const SUCCESS_PAYMENT_EVENT = 'successful-payment'
