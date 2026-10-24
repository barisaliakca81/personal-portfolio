import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const targets = [
  ['cilltech', 'https://cilltech.vercel.app/'],
  ['estedore', 'https://estedore.com/'],
  ['hillora', 'https://hillora.com/'],
  ['zynon', 'https://zynon.com.tr/'],
  ['zeytinli-yasam-koyu', 'https://zeytinliyasamkoyu.com/'],
]
await mkdir('public/images/projects', { recursive: true })
await mkdir('.tmp/project-captures', { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const results = []
try {
  for (const [slug, url] of targets.filter(([slug]) => process.argv.length < 3 || process.argv.slice(2).includes(slug))) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, reducedMotion: 'reduce', ignoreHTTPSErrors: false })
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 40000 })
      await Promise.race([page.evaluate(() => document.fonts.ready), new Promise((resolve) => setTimeout(resolve, 8000))])
      await page.waitForTimeout(4500)
      if (slug === 'zeytinli-yasam-koyu') await page.getByRole('button', { name: 'Reject All', exact: true }).click({ timeout: 3000 }).catch(() => {})
      if (slug === 'estedore') await page.getByText('x', { exact: true }).first().click({ timeout: 3000 }).catch(() => {})
      const title = await page.title()
      const text = (await page.locator('body').innerText()).slice(0, 1800)
      await page.screenshot({ path: `public/images/projects/${slug}.jpg`, type: 'jpeg', quality: 82 })
      results.push({ slug, url, status: response?.status(), title, text })
      console.log(`${slug}: ${response?.status()} ${title}`)
    } catch (error) {
      results.push({ slug, url, error: error.message })
      console.log(`${slug}: ${error.message}`)
    } finally { await page.close() }
  }
} finally { await browser.close() }
await writeFile('.tmp/project-captures/results.json', JSON.stringify(results, null, 2))
