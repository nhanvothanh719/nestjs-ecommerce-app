import {
  BadRequestException,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import path from 'path'
import { MediaService } from 'src/routes/media/media.service'
import { FIELD_NAME, MAX_COUNT, MAX_SIZE_PER_IMAGE, UPLOAD_DIR } from 'src/shared/constants/media.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { AwsS3Service } from 'src/shared/services/aws_s3.service'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

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
    return this.mediaService.uploadImagesToS3(files)
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const notFoundException = new NotFoundException('File not found')
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        res.status(notFoundException.getStatus()).json(notFoundException.getResponse())
      }
    })
  }
}
