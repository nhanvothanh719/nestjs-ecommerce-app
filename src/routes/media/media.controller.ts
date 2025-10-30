import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('media')
export class MediaController {
  @Post('images/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Only image files are allowed'), false)
        }
        cb(null, true)
      },
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }), // 3MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return {
      message: 'Upload file successfully',
    }
  }
}
