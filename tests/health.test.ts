import { GET as health } from '@/app/api/health/route'
import { describe, it, expect } from 'vitest'

describe('health api', () => {
  it('returns ok true', async () => {
    const res = await health()
    const json = await res.json()
    expect(json.ok).toBe(true)
  })
})
