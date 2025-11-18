import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from 'src/routes/auth/auth.module'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter'
import { LanguageModule } from './routes/language/language.module'
import { PermissionModule } from './routes/permission/permission.module'
import { RoleModule } from './routes/role/role.module'
import { ProfileModule } from './routes/profile/profile.module'
import { UserModule } from './routes/user/user.module'
import { MediaModule } from './routes/media/media.module'
import { BrandModule } from './routes/brand/brand.module'
import { BrandTranslationModule } from './routes/brand-translation/brand-translation.module'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { CategoryModule } from './routes/category/category.module'
import { CategoryTranslationModule } from './routes/category-translation/category-translation.module'
import { ProductModule } from './routes/product/product.module'
import { ProductTranslationModule } from './routes/product-translation/product-translation.module'
import { CartModule } from './routes/cart/cart.module'
import { OrderModule } from './routes/order/order.module'
import { PaymentModule } from './routes/payment/payment.module'
import { BullModule } from '@nestjs/bullmq'
import path from 'path'
import envConfig from 'src/shared/config'
import { PaymentConsumer } from 'src/queues/payment.consumer'
import { WebsocketModule } from './websocket/websocket.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { ThrottlerBehindProxyGuard } from 'src/shared/guards/throttler-behind-proxy.guard'
import { ReviewModule } from './routes/review/review.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: envConfig.REDIS_HOST,
        port: envConfig.REDIS_PORT,
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Ngôn ngữ mặc định (sử dụng khi không tìm thấy ngôn ngữ phù hợp từ request)
      // Cấu hình nơi load các file ngôn ngữ
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        // Tự động reload file dịch khi thay đổi (chỉ nên bật trong môi trường dev)
        watch: true,
      },
      // Xác định cách lấy ngôn ngữ từ request
      resolvers: [
        // 1. Ưu tiên lấy ngôn ngữ từ query string, ví dụ: `?lang=vi`
        { use: QueryResolver, options: ['lang'] },
        // 2. Nếu không có query `?lang=`, lấy từ header `Accept-Language`
        AcceptLanguageResolver,
      ],
      // [Optional] Type safety: Build ra tại file `src/generated/i18n.generated.ts` --> Gợi ý code
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts'),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'allow-10-request-per-minute',
          ttl: 60 * 1000, // 1 min
          limit: 10,
        },
        {
          name: 'allow-15-request-per-2-minutes',
          ttl: 2 * 60 * 1000, // 2 min
          limit: 15,
        },
      ],
    }),
    SharedModule,
    AuthModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule,
    OrderModule,
    PaymentModule,
    WebsocketModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    PaymentConsumer,
  ],
})
export class AppModule {}
