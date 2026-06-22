import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireApiKey } from "./_auth";

/**
 * Kiểm tra header x-api-key có khớp với biến môi trường API_KEY trên Vercel không.
 * Trả về true nếu hợp lệ (cho phép tiếp tục xử lý).
 * Trả về false nếu không hợp lệ (đã tự gửi response 401, handler nên return luôn).
 */
export function requireApiKey(req: VercelRequest, res: VercelResponse): boolean {
  const expectedKey = process.env.API_KEY;

  // Nếu chưa cấu hình API_KEY trên Vercel, coi như chưa bật bảo mật (tránh tự khóa mình lúc demo quên set env)
  if (!expectedKey) return true;

  const providedKey = req.headers["x-api-key"];

  if (providedKey !== expectedKey) {
    res.status(401).json({
      error: "Không có quyền truy cập, thiếu hoặc sai API Key",
      error_en: "Unauthorized: missing or invalid x-api-key header",
    });
    return false;
  }

  return true;
}