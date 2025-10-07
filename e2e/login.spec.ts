import { test, expect } from '@playwright/test'

test('login and view transactions', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('email').fill('admin@local')
  await page.getByPlaceholder('password').fill('admin')

  const [loginRes] = await Promise.all([
    page.waitForResponse(res => res.url().includes('/api/login') && res.ok()),
    page.getByRole('button', { name: 'Sign in' }).click(),
  ])

  // Điều hướng thủ công để tránh race-condition với router.push
  await page.goto('/transactions')
  await expect(page.getByText('Transactions')).toBeVisible()
})
