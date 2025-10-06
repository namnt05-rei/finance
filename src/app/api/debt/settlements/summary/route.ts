import { NextResponse } from 'next/server'
import { db } from '@/db/client'
import { debt_movements, debt_settlements } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const movementId = searchParams.get('movementId')
  if (!movementId) return NextResponse.json({ ok:false, error:'movementId required' }, { status:400 })

  const [movement] = await db.select().from(debt_movements).where(eq(debt_movements.id, movementId))
  if (!movement) return NextResponse.json({ ok:false, error:'not_found' }, { status:404 })

  const sums = await db.select({ totalPaid: sql<number>`coalesce(sum(${debt_settlements.amount_paid}),0)` })
    .from(debt_settlements)
    .where(eq(debt_settlements.movement_id, movementId))

  const totalPaid = Number(sums[0]?.totalPaid || 0)
  const expectedTotal = movement.amount
  const remaining = expectedTotal - totalPaid

  return NextResponse.json({ ok:true, data: { movement, expectedTotal, totalPaid, remaining } })
}
