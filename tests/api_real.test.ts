import { beforeAll, describe, it, expect } from 'vitest'
import { db } from '@/db/client'
import { accounts } from '@/db/schema'
import { GET as txGet, POST as txPost } from '@/app/api/transactions/route'

beforeAll(async () => {
  // seed 1 account để thỏa FK; nếu đã có thì noop
  await db.insert(accounts)
    .values({ id: 'acc-1', name: 'Test Account' })
    .onConflictDoNothing({ target: accounts.id })
})

describe.runIf(!!process.env.DATABASE_URL)('transactions real api', () => {
  it('POST creates a txn', async () => {
    const req = new Request('http://local', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ account_id: 'acc-1', amount: 1000, type: 'exp' })
    })
    const res = await txPost(req)
    const j = await res.json()
    expect([200,201]).toContain(res.status)
    expect(j.ok).toBe(true)
    expect(typeof j.id).toBe('string')
  })

  it('GET returns list', async () => {
    const res = await txGet(new Request('http://local'))
    const j = await res.json()
    expect(j.ok).toBe(true)
    expect(Array.isArray(j.data)).toBe(true)
  })
})
