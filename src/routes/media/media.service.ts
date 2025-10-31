import { Injectable } from '@nestjs/common'
import { AwsS3Service } from 'src/shared/services/aws_s3.service'
import { unlink } from 'fs/promises'
import { generateFileName } from 'src/shared/helpers'
import { RequiredFileException } from 'src/routes/media/media.error'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: AwsS3Service) {}

  async uploadImagesToS3(files: Array<Express.Multer.File>): Promise<({ url: string | undefined } | undefined)[]> {
    if (!files || files.length === 0) {
      throw RequiredFileException
    }

    // Upload images to AWS S3
    const result = await Promise.all([
      ...files.map((file) => {
        const uploadResult = this.s3Service.uploadFile({
          filename: 'images/' + file.filename,
          filepath: file.path,
          contentType: file.mimetype,
        })
        return uploadResult ? uploadResult.then((res) => ({ url: res.Location })) : Promise.resolve(undefined)
      }),
    ])

    // Delete images uploaded to server
    await Promise.all(
      files.map((file) => {
        return unlink(file.path)
      }),
    )

    return result
  }

  async getPresignedUrl({ filename }: { filename: string }): Promise<{ presignedUrl: string; imageUrl: string }> {
    const randomFileName = generateFileName(filename)
    const presignedUrl = await this.s3Service.createPresignedUrlWithS3Client(randomFileName)
    const imageUrl = presignedUrl.split('?')[0]
    return {
      presignedUrl,
      imageUrl,
    }
  }
}
