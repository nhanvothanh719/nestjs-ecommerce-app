import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { FIELD_NAME, MAX_COUNT, MAX_SIZE_PER_IMAGE } from 'src/shared/constants/media.constant'

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor(FIELD_NAME, MAX_COUNT, {
      fileFilter(req, file, callback) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Only image files are allowed'), false)
        }
        callback(null, true)
      },
    }),
  )
  uploadImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_SIZE_PER_IMAGE })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return {
      message: `Upload ${files.length} file(s) successfully`,
    }
  }
}
