import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { cashback_movements } from '@/db/schema'
import { and, eq, sql } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const accountId = searchParams.get('accountId')
  const cycleTag = searchParams.get('cycleTag')
  if (!accountId || !cycleTag) return NextResponse.json({ ok:false, error:'accountId & cycleTag required' }, { status:400 })

  const [row] = await db.select({
    sumAmount: sql<number>`coalesce(sum(${cashback_movements.amount}),0)`,
    sumPercentBps: sql<number>`coalesce(sum(${cashback_movements.percent_bps}),0)`,
    sumAmountBack: sql<number>`coalesce(sum(${cashback_movements.amount_back}),0)`,
  }).from(cashback_movements)
   .where(and(eq(cashback_movements.account_id, accountId), eq(cashback_movements.cycle_tag, cycleTag)))

  return NextResponse.json({ ok:true, data: row })
}
