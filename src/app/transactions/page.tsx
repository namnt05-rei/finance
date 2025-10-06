import { getRequestBaseUrl } from '@/lib/base-url'

type TxnRow = {
  id: string
  account_id: string
  amount: number
  type: string
  created_at: string | Date
}

async function getTxns(): Promise<TxnRow[]> {
  const base = getRequestBaseUrl()
  const res = await fetch(`${base}/api/transactions`, { cache: 'no-store' })
  if (!res.ok) return []
  const j = (await res.json()) as { ok: boolean; data: TxnRow[] }
  return j.data ?? []
}

export default async function Transactions(){
  const data = await getTxns()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transactions</h1>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Account</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 font-mono text-xs">{r.id}</td>
                <td className="p-2">{r.account_id}</td>
                <td className="p-2">{r.amount}</td>
                <td className="p-2">{r.type}</td>
                <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td className="p-4" colSpan={5}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
