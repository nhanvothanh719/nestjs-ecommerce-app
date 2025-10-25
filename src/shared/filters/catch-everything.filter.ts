import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { isPrismaUniqueConstraintFailedError } from 'src/shared/helpers'

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    let httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    let message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error'

    if (isPrismaUniqueConstraintFailedError(exception)) {
      httpStatus = HttpStatus.CONFLICT
      message = 'Record has already existed'
    }

    const responseBody = {
      statusCode: httpStatus,
      message,
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
