import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({ ok: true, data: [] })
}
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  if (!body || typeof body !== 'object') return NextResponse.json({ ok: false, error: 'INVALID_BODY' }, { status: 400 })
  return NextResponse.json({ ok: true, id: 'stub-id', data: body }, { status: 201 })
}
