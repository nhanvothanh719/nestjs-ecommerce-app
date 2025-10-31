import { Module } from '@nestjs/common'
import { MediaService } from './media.service'
import { MediaController } from './media.controller'
import { MulterModule } from '@nestjs/platform-express'
import multer from 'multer'
import { generateFileName } from 'src/shared/helpers'
import { existsSync, mkdirSync } from 'fs'
import { UPLOAD_DIR } from 'src/shared/constants/media.constant'

// Cấu hình storage cho Multer - thư viện quản lý file upload
const storage = multer.diskStorage({
  // Xác định thư mục đích để lưu file upload
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR)
  },
  // Đặt lại tên file trước khi lưu
  filename: (req, file, cb) => {
    const newFilename = generateFileName(file.originalname)
    cb(null, newFilename)
  },
})

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {
  constructor() {
    // Tạo folder `/upload` trong trường hợp chưa có khi run app
    try {
      if (!existsSync(UPLOAD_DIR)) {
        mkdirSync(UPLOAD_DIR, { recursive: true })
      }
    } catch (error) {
      throw new Error(`Failed to create upload directory at ${UPLOAD_DIR}: ${error.message}`)
    }
  }
}
