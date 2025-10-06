import { z } from 'zod'
export const TxnCreate = z.object({
  account_id: z.string().min(1),
  amount: z.number().int().positive(),
  type: z.enum(['income','exp','tf','lend','borrow','repay','creditpay']).default('exp'),
  people_id: z.string().optional(),
  category_id: z.string().optional(),
  note: z.string().optional(),
})
export type TxnCreateInput = z.infer<typeof TxnCreate>
