export const RoleName = {
  Admin: 'ADMIN',
  Seller: 'SELLER',
  Client: 'CLIENT',
} as const
export const TOTAL_ROLES = Object.keys(RoleName).length
