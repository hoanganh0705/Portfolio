import { test, expect } from '@playwright/test'

test('home page loads and shows core navigation', async ({ page }) => {
  await page.goto('/en')

  await expect(page).toHaveTitle(/Anh Nguyen Dev/i)
  const header = page.getByRole('banner')
  await expect(header.getByRole('link', { name: /^blog$/i })).toBeVisible()
  await expect(header.getByRole('link', { name: /^contact$/i })).toBeVisible()
})
