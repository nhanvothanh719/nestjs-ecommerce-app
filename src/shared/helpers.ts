import { Prisma } from 'generated/prisma'
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library'

export const isPrismaUniqueConstraintFailedError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof PrismaClientKnownRequestError && error.code === 'P2002'
}

export const isPrismaNotFoundError = (error: any): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof PrismaClientKnownRequestError && error.code === 'P2025'
}
