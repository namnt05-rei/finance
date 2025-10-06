import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { transactions } from '@/db/schema'
import { eq, desc, and, like } from 'drizzle-orm'
import { TxnCreate } from '@/lib/transactions.schema'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const limit = Number(searchParams.get('limit') || '20')
  const data = await db.select().from(transactions)
    .where(q ? like(transactions.note, `%${q}%`) : undefined)
    .orderBy(desc(transactions.created_at))
    .limit(limit)
  return NextResponse.json({ ok: true, data })
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => ({}))
  const parsed = TxnCreate.safeParse(json)
  if (!parsed.success) return NextResponse.json({ ok:false, error:'VALIDATION', issues: parsed.error.issues }, { status: 400 })
  const id = crypto.randomUUID()
  const row = { id, ...parsed.data, created_at: new Date() }
  await db.insert(transactions).values(row)
  return NextResponse.json({ ok:true, id }, { status: 201 })
}
