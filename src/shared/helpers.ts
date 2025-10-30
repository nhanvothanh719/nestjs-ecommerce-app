import { randomInt } from 'crypto'
import { Prisma } from 'generated/prisma'

export const isPrismaUniqueConstraintFailedError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export const isPrismaNotFoundError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

/**
 * Xảy ra trong trường hợp truyền foreign key bị lỗi (Ex: user.roleId, ...)
 */
export const isPrismaForeignKeyConstraintError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}

export const generateOTP = (): string => {
  return String(randomInt(100000, 1000000))
}
