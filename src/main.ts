import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { CustomWebsocketAdapter } from 'src/websocket/websocket.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()

  // Apply custom websocket adapter
  app.useWebSocketAdapter(new CustomWebsocketAdapter(app))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
