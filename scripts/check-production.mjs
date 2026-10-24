import { spawn } from 'node:child_process'
import { once } from 'node:events'
import assert from 'node:assert/strict'
import { setTimeout as pause } from 'node:timers/promises'
import { chromium } from '@playwright/test'

const port = 5188
const base = process.env.VITE_BASE_PATH || '/'
const address = `http://127.0.0.1:${port}${base}`
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
  cwd: process.cwd(), windowsHide: true, stdio: 'pipe', env: process.env,
})
let output = ''
server.stdout.on('data', (data) => { output += data.toString() })
server.stderr.on('data', (data) => { output += data.toString() })
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview could not start: ${output}`)
    try { ready = (await fetch(address)).ok } catch { /* wait for our server */ }
    if (ready) break
    await pause(250)
  }
  assert(ready, 'Preview did not become ready')
  browser = await chromium.launch({ channel: 'msedge', headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  const errors = []
  const failed = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`) })
  await page.goto(address)
  await page.getByRole('heading', { level: 1 }).waitFor()
  assert.equal(await page.locator('main > section').count(), 6)
  assert.equal(await page.locator('#yazilar').count(), 0)
  await page.locator('#projeler').scrollIntoViewIfNeeded()
  const images = await page.locator('.project-image img').evaluateAll((elements) => elements.map((image) => ({ src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth > 0 })))
  for (const image of images) {
    assert(image.src.startsWith(base), `Wrong image base: ${image.src}`)
    assert((await fetch(new URL(image.src, address))).ok, `Image missing: ${image.src}`)
  }
  await page.goto(`${address}?lang=en#/proje/cilltech`)
  await page.getByRole('dialog').waitFor()
  await page.reload()
  await page.getByRole('dialog').waitFor()
  assert((await page.getByRole('dialog').innerText()).includes('CillTech'))
  assert.equal(await page.locator('html').getAttribute('lang'), 'en')
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('dialog').count(), 0)
  for (const language of ['tr', 'en']) {
    const response = await fetch(address + 'cv/baris-ali-akca-cv-' + language + '.pdf')
    assert(response.ok, 'CV missing: ' + language)
    assert.equal(Buffer.from(await response.arrayBuffer()).subarray(0, 5).toString(), '%PDF-')
  }
  assert.deepEqual(errors, [])
  assert.deepEqual(failed, [])
  console.log(`Production smoke check passed: base=${base}; 6 sections; project images; TR/EN PDFs; English detail route; reload; Escape; no page errors or HTTP errors.`)
} finally {
  await browser?.close()
  if (server.exitCode === null) {
    const stopped = once(server, 'exit')
    server.kill()
    await stopped
  }
}
