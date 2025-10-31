import { ParseFileOptions, ParseFilePipe } from '@nestjs/common'
import { unlink } from 'fs/promises'

export class ParseFilePipeWithUnlink extends ParseFilePipe {
  constructor(options?: ParseFileOptions) {
    super(options)
  }

  // Custom lại method `transform` cửa class `ParseFilePipe`
  async transform(files: Array<Express.Multer.File>): Promise<any> {
    return super.transform(files).catch(async (error) => {
      console.error(error)
      // Delete uploaded files when having error
      await Promise.all(files.map((file) => unlink(file.path)))

      throw error
    })
  }
}
