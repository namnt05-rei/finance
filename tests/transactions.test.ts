import { GET, POST } from '@/app/api/transactions/route'
import { describe, it, expect } from 'vitest'

describe('transactions api', () => {
  it('GET returns empty list', async () => {
    const res = await GET()
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
  })
  it('POST validates body and returns stub id', async () => {
    const req = new Request('http://test.local', { method: 'POST', body: JSON.stringify({ amount: 123 }) })
    const res = await POST(req)
    const json = await res.json()
    expect(res.status).toBe(201)
    expect(json.ok).toBe(true)
    expect(json.id).toBeTypeOf('string')
  })
})
