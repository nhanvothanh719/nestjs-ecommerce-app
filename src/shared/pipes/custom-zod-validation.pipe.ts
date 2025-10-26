import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe: typeof ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException(
      error.issues.map((issue) => {
        return {
          ...issue,
          path: issue.path.join('.'),
        }
      }),
    )
  },
})
export default CustomZodValidationPipe
