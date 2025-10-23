import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { TransformResponseInterceptor } from 'src/shared/interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
