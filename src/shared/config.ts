import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import * as z from 'zod'

// Check `.env` file existence
if (!fs.existsSync(path.resolve('.env'))) {
  console.error('>>> File `.env` không tồn tại')
  // MEMO: Exit code 1 indicates an error or failure.
  process.exit(1)
}
// MEMO: Load biến môi trường vào `process.env`
dotenv.config({ path: path.resolve('.env') })

// Validate environment variables
const envConfigSchema = z.object({
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string().min(5),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string().min(5),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_API_KEY: z.string().min(5),
  ADMIN_USER_NAME: z.string(),
  ADMIN_USER_EMAIL: z.string(),
  ADMIN_USER_PASSWORD: z.string(),
  ADMIN_USER_PHONE_NUMBER: z.string(),
  OTP_EXPIRES_IN: z.string(),
  RESEND_API_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string(),
  SERVER_URL: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_ACCESS_KEY: z.string(),
  AWS_S3_SECRET_ACCESS_KEY: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
})
const parsedEnvConfig = envConfigSchema.safeParse(process.env)

if (!parsedEnvConfig.success) {
  console.error('>>> Giá trị khai báo trong file `.env` không hợp lệ')
  console.error(parsedEnvConfig.error)
  process.exit(1)
}

const envConfig = parsedEnvConfig.data
export default envConfig
