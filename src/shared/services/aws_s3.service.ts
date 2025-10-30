import { Upload } from '@aws-sdk/lib-storage'
import { S3 } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import envConfig from 'src/shared/config'
import { readFileSync } from 'fs'

@Injectable()
export class AwsS3Service {
  // S3 client for interacting with AWS S3
  private s3: S3

  constructor() {
    // Initialize S3 client
    this.s3 = new S3({
      region: envConfig.AWS_REGION,
      credentials: {
        accessKeyId: envConfig.AWS_S3_ACCESS_KEY,
        secretAccessKey: envConfig.AWS_S3_SECRET_ACCESS_KEY,
      },
    })
  }

  /**
   * Upload file lên AWS S3 sử dụng cơ chế multipart upload
   * Document: https://www.npmjs.com/package/@aws-sdk/lib-storage
   */
  uploadFile({ filename, filepath, contentType }: { filename: string; filepath: string; contentType: string }) {
    try {
      const parallelUploads3 = new Upload({
        client: this.s3,
        params: {
          Bucket: envConfig.AWS_S3_BUCKET_NAME,
          Key: filename, // Filename after uploading to S3
          Body: readFileSync(filepath),
          ContentType: contentType,
        },
        // (optional) concurrency configuration
        queueSize: 4,
        // (optional) size of each part, in bytes, at least 5MB
        partSize: 1024 * 1024 * 5,
        // (optional) when true, do not automatically call AbortMultipartUpload when
        // a multipart upload fails to complete. You should then manually handle
        // the leftover parts.
        leavePartsOnError: false,
      })

      /**
       * Bắt sự kiện tiến độ upload
       * (Enable để in ra log mỗi khi upload được một phần)
       */
      // parallelUploads3.on('httpUploadProgress', (progress) => {
      //   console.log(progress)
      // })

      // Gọi phương thức .done() để bắt đầu upload và trả về Promise hoàn thành
      return parallelUploads3.done()
    } catch (error) {
      console.error(error)
    }
  }
}
