import { randomInt } from 'crypto'
import { Prisma } from 'generated/prisma'

export const isPrismaUniqueConstraintFailedError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export const isPrismaNotFoundError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export const generateOTP = (): string => {
  return String(randomInt(100000, 1000000))
}
