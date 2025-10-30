import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { STATIC_MEDIA_PREFIX, UPLOAD_DIR } from 'src/shared/constants/media.constant'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()

  // MEMO: To use this the `<NestExpressApplication>` generic type must be passed
  app.useStaticAssets(UPLOAD_DIR, { prefix: STATIC_MEDIA_PREFIX })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
