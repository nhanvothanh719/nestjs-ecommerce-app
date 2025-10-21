import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from 'generated/prisma'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      // MEMO: For debug: 
      // log: ['query', 'warn', 'error']
      log: ['info'],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }
}
