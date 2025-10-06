import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
export const test_table = pgTable('test_table', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }),
  created_at: timestamp('created_at').defaultNow()
})
