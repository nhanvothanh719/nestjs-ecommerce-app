import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { CustomWebsocketAdapter } from 'src/websocket/websocket.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()

  const customWebsocketAdapter = new CustomWebsocketAdapter(app)
  await customWebsocketAdapter.initRedisAdapter()

  // Apply custom websocket adapter
  app.useWebSocketAdapter(customWebsocketAdapter)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
