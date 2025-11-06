import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  /**
   * Lấy tracker cho throttling:
   * - Nếu app chạy sau reverse proxy và trust proxy = true, Express sẽ fill req.ips (mảng IP từ X-Forwarded-For)
   * - Sử dụng req.ips[0] (client IP thật) khi có, ngược lại fallback về req.ip
   */
  protected getTracker(req: Record<string, any>): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip
  }
}
