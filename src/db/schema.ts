import { pgTable, uuid, varchar, integer, boolean, text, timestamp } from 'drizzle-orm/pg-core'

// USERS & PEOPLE ------------------------------------------------------------
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull(),
  password_hash: varchar('password_hash', { length: 255 }),
  created_at: timestamp('created_at').defaultNow()
})

export const people = pgTable('people', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  is_group: boolean('is_group').default(false),
  credit_topup: integer('credit_topup').default(0),
  created_at: timestamp('created_at').defaultNow()
})

export const user_people_map = pgTable('user_people_map', {
  user_id: uuid('user_id').notNull().references(() => users.id),
  person_id: varchar('person_id', { length: 36 }).notNull().references(() => people.id),
  is_owner: boolean('is_owner').default(false)
})

// ACCOUNTS ------------------------------------------------------------------
export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  account_type: text('account_type'),
  credit_limit: integer('credit_limit').default(0),
  shared_limit: boolean('shared_limit').default(false),
  parent_account_id: varchar('parent_account_id', { length: 36 }),
  is_cashback_eligible: boolean('is_cashback_eligible').default(false),
  cashback_percentage_bps: integer('cashback_percentage_bps').default(0),
  max_cashback_amount: integer('max_cashback_amount'),
  min_spend_for_cashback: integer('min_spend_for_cashback'),
  created_at: timestamp('created_at').defaultNow()
})

// CATEGORIES ----------------------------------------------------------------
export const categories = pgTable('categories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  transaction_nature: varchar('transaction_nature', { length: 3 }).notNull() // IN, EX, TF
})

export const subcategories = pgTable('subcategories', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  category_id: varchar('category_id', { length: 36 }).references(() => categories.id),
  pl_type: varchar('pl_type', { length: 40 }),
  is_link_type: boolean('is_link_type').default(false)
})

// TRANSACTIONS --------------------------------------------------------------
export const transactions = pgTable('transactions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  account_id: varchar('account_id', { length: 36 }).references(() => accounts.id).notNull(),
  people_id: varchar('people_id', { length: 36 }).references(() => people.id),
  category_id: varchar('category_id', { length: 36 }).references(() => categories.id),
  subcategory_id: varchar('subcategory_id', { length: 36 }).references(() => subcategories.id),
  type: varchar('type', { length: 10 }).notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  tag: varchar('tag', { length: 12 }),
  created_at: timestamp('created_at').defaultNow()
})

// LINKED TXN ---------------------------------------------------------------
export const linked_txn = pgTable('linked_txn', {
  id: uuid('id').primaryKey().defaultRandom(),
  parent_txn_id: varchar('parent_txn_id', { length: 36 }).references(() => transactions.id),
  link_type_id: varchar('link_type_id', { length: 36 }).references(() => subcategories.id),
  amount: integer('amount'),
  is_confirmed: boolean('is_confirmed').default(false),
  created_at: timestamp('created_at').defaultNow()
})

// DEBT ----------------------------------------------------------------------
export const debt_movements = pgTable('debt_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  people_id: varchar('people_id', { length: 36 }).references(() => people.id).notNull(),
  txn_id: varchar('txn_id', { length: 36 }).references(() => transactions.id),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  note: text('note'),
  occurred_at: timestamp('occurred_at').defaultNow(),
  created_at: timestamp('created_at').defaultNow()
})

export const debt_settlements = pgTable('debt_settlements', {
  id: uuid('id').primaryKey().defaultRandom(),
  movement_id: uuid('movement_id').references(() => debt_movements.id).notNull(),
  amount_paid: integer('amount_paid').notNull(),
  paid_at: timestamp('paid_at').defaultNow(),
  note: text('note')
})

// CASHBACK ------------------------------------------------------------------
export const cashback_movements = pgTable('cashback_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  txn_id: varchar('txn_id', { length: 36 }).references(() => transactions.id),
  account_id: varchar('account_id', { length: 36 }).references(() => accounts.id).notNull(),
  program: text('program'),
  cycle_tag: varchar('cycle_tag', { length: 10 }),
  type: varchar('type', { length: 20 }),
  percent_bps: integer('percent_bps').default(0),
  amount: integer('amount').notNull(),
  amount_back: integer('amount_back'),
  note: text('note'),
  created_at: timestamp('created_at').defaultNow()
})

