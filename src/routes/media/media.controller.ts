import {
  BadRequestException,
  Body,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'
import path from 'path'
import { MediaService } from 'src/routes/media/media.service'
import { ParseFilePipeWithUnlink } from 'src/routes/media/parse-file-pipe-with-unlink.pipe'
import { FIELD_NAME, MAX_COUNT, MAX_SIZE_PER_IMAGE, UPLOAD_DIR } from 'src/shared/constants/media.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

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
      new ParseFilePipeWithUnlink({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_SIZE_PER_IMAGE })],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.mediaService.uploadImagesToS3(files)
  }

  @Post('images/upload/presigned-url')
  @IsPublic()
  async createPresignedUrl(@Body() body: { filename: string }) {
    return this.mediaService.getPresignedUrl(body)
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
