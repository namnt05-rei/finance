import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// Next.js sẽ nạp .env.* => không cần 'dotenv/config'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon yêu cầu SSL; chuỗi của bạn đã có sslmode=require,
  // nhưng thêm safeguard cho local cases:
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
})

// Không connect ở import-time; drizzle nhận pool và tự quản lý
export const db = drizzle(pool)
