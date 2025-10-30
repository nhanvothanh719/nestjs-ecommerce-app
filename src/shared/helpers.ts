import { randomInt } from 'crypto'
import { Prisma } from 'generated/prisma'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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

export const generateFileName = (filename: string): string => {
  const fileExtension = path.extname(filename)
  const uuid = uuidv4()
  return `${uuid}${fileExtension}`
}
