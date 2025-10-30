import { Injectable } from '@nestjs/common'
import { AwsS3Service } from 'src/shared/services/aws_s3.service'
import { unlink } from 'fs/promises'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: AwsS3Service) {}

  async uploadImagesToS3(files: Array<Express.Multer.File>) {
    // Upload images to AWS S3
    const result = await Promise.all([
      ...files.map((file) => {
        return this.s3Service
          .uploadFile({
            filename: 'images/' + file.filename,
            filepath: file.path,
            contentType: file.mimetype,
          })
          ?.then((res) => ({ url: res.Location }))
      }),
    ])

    // Delete images uploaded to server
    await Promise.all([
      ...files.map((file) => {
        return unlink(file.path)
      }),
    ])

    return result
  }
}
