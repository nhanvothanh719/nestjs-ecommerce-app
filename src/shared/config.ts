import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import z from 'zod'

// Check `.env` file existence
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('>>> File `.env` không tồn tại')
  process.exit(1)
}
// MEMO: Load biến môi trường vào `process.env`
dotenv.config({ path: path.resolve('.env') })

// Validate environment variables
const envConfigSchema = z.object({
  DATABASE_URL: z.string().url(),
  ACCESS_TOKEN_SECRET: z.string().min(5),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string().min(5),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_API_KEY: z.string().min(5),
})
const parsedEnvConfig = envConfigSchema.safeParse(process.env)

if (!parsedEnvConfig.success) {
  console.error('>>> Giá trị khai báo trong file `.env` không hợp lệ')
  console.error(parsedEnvConfig.error)
  process.exit(1)
}

const envConfig = parsedEnvConfig.data
export default envConfig
