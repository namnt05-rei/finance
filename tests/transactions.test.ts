import { GET, POST } from '@/app/api/transactions/route'
import { describe, it, expect } from 'vitest'

describe.runIf(!!process.env.DATABASE_URL)('transactions api (stub compatibility)', () => {
  it('GET returns ok true', async () => {
    const res = await GET(new Request('http://local'))
    const json = await res.json()
    expect(json.ok).toBe(true)
  })
  it('POST returns ok true with stub body', async () => {
    const req = new Request('http://local', { method: 'POST', body: JSON.stringify({ amount: 123, account_id: 'acc-1', type:'exp' }) })
    const res = await POST(req)
    const json = await res.json()
    expect([200,201]).toContain(res.status)
    expect(json.ok).toBe(true)
  })
})
