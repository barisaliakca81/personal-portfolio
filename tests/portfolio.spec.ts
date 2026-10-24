import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const sectionIds = ['merhaba', 'hakkimda', 'yetenekler', 'projeler', 'ozgecmis', 'iletisim']

test('personal identity, education, skills and contact are accurate', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/?lang=tr')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Barış Ali')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AKÇA')
  await expect(page.locator('main > section')).toHaveCount(6)
  await expect(page.locator('#yazilar')).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText('Adınız')
  await expect(page.locator('body')).not.toContainText('örnek teknoloji')
  const technologyNames = await page.locator('.skill-item > span:last-child').allTextContents()
  for (const technology of ['JavaScript', 'TypeScript', 'Python', 'Java', 'C# (.NET)', 'PHP', 'C++', 'React.js', 'Tailwind CSS', 'Bootstrap', 'Django', 'FastAPI', 'Flask', 'Spring Boot', '.NET Core', 'Laravel', 'PostgreSQL', 'Microsoft SQL Server', 'MySQL', 'Git', 'GitHub', 'Figma', 'Adobe XD']) {
    expect(technologyNames).toContain(technology)
  }
  await expect(page.locator('#ozgecmis')).toContainText('GNO: 3,10')
  await expect(page.locator('#ozgecmis')).toContainText('Anadolu Üniversitesi')
  await expect(page.locator('#ozgecmis')).toContainText('Creovers Digital Agency')
  await expect(page.locator('#ozgecmis')).toContainText('Giga Yazılım')
  await expect(page.locator('.email-link')).toHaveAttribute('href', 'mailto:barisaliakca81@gmail.com')
  await expect(page.locator('.social-links a')).toHaveCount(2)
  expect(errors).toEqual([])
})

test('navigation and mobile menu remain accessible', async ({ page, isMobile }) => {
  await page.goto('/?lang=tr')
  if (isMobile) await page.getByRole('button', { name: 'Menüyü aç' }).click()
  await page.getByRole('navigation', { name: 'Ana menü' }).getByRole('link', { name: 'Projeler', exact: true }).click()
  await expect(page).toHaveURL(/#projeler$/)
  await expect(page.locator('.main-nav a[href="#projeler"]')).toHaveAttribute('aria-current', 'location')
  if (isMobile) {
    await page.getByRole('button', { name: 'Menüyü aç' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Menüyü aç' })).toBeFocused()
  }
})

test('all real previews, filters, live links and detail routes work', async ({ page }) => {
  await page.goto('/?lang=tr#projeler')
  await expect(page.locator('.project-card')).toHaveCount(5)
  for (const image of await page.locator('.project-image img').all()) {
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0)).toBe(true)
  }
  await page.getByRole('button', { name: 'E-ticaret', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(1)
  await expect(page.locator('.project-card')).toContainText('Hillora')
  const preview = page.locator('.project-image')
  await preview.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByRole('link', { name: /Siteyi ziyaret et/ })).toHaveAttribute('href', 'https://hillora.com/')
  await page.keyboard.press('Escape')
  await expect(preview).toBeFocused()
  await page.getByRole('button', { name: 'Tümü', exact: true }).click()
  await expect(page.locator('.project-card')).toHaveCount(5)
  await page.goto('/?lang=tr#/proje/cilltech')
  await page.reload()
  await expect(page.getByRole('dialog')).toContainText('CillTech')
  await page.getByRole('button', { name: 'Pencereyi kapat' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goto('/?lang=tr#/proje/bilinmeyen')
  await expect(page.getByRole('heading', { name: 'Bu sayfa bulunamadı.' })).toBeVisible()
})

test('language changes all sections, persists, and selects the correct PDF', async ({ page, request }, testInfo) => {
  await page.goto('/?lang=tr#ozgecmis')
  await page.getByRole('button', { name: 'English', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('#ozgecmis')).toContainText('GPA: 3.10')
  await expect(page.locator('#ozgecmis')).toContainText('Associate degree')
  await expect(page.locator('#hakkimda')).toContainText('I started programming')
  await expect(page.locator('.cv-card a')).toHaveAttribute('href', '/cv/baris-ali-akca-cv-en.pdf')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.getByRole('button', { name: 'Türkçe', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('link', { name: 'CV’yi indir', exact: true }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('baris-ali-akca-cv-tr.pdf')
  await download.saveAs(testInfo.outputPath('downloaded-cv-tr.pdf'))
  for (const lang of ['tr', 'en']) {
    const response = await request.get('/cv/baris-ali-akca-cv-' + lang + '.pdf')
    expect(response.ok()).toBe(true)
    expect((await response.body()).subarray(0, 5).toString()).toBe('%PDF-')
  }
})

test('both languages fit responsive widths and respect reduced motion', async ({ page, isMobile }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const lang of ['tr', 'en']) {
    await page.goto('/?lang=' + lang)
    for (const width of isMobile ? [320, 375, 390, 768] : [1024, 1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), lang + ' overflow at ' + width).toBe(true)
      expect(await page.locator('h1').evaluate((element) => element.scrollWidth <= element.clientWidth + 2), lang + ' name overflow at ' + width).toBe(true)
    }
    expect(await page.locator('.cursor').first().evaluate((element) => getComputedStyle(element).animationName)).toBe('none')
    await page.setViewportSize({ width: isMobile ? 390 : 1440, height: isMobile ? 844 : 1000 })
    for (const id of sectionIds) {
      await page.evaluate((sectionId) => { document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'instant' }) }, id)
      await page.screenshot({ path: testInfo.outputPath(lang + '-' + id + '.png'), scale: 'css' })
    }
  }
})

test('WCAG AA automated audit in both languages and detail dialog', async ({ page, isMobile }) => {
  test.setTimeout(90000)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const lang of ['tr', 'en']) {
    await page.goto('/?lang=' + lang)
    for (const id of sectionIds) {
      await page.evaluate((sectionId) => { document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'instant' }) }, id)
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(result.violations, lang + ' accessibility at ' + id).toEqual([])
    }
    await page.goto('/?lang=' + lang + '#/proje/cilltech')
    await expect(page.getByRole('dialog')).toBeVisible()
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
    await page.keyboard.press('Escape')
    if (isMobile) {
      await page.getByRole('button', { name: lang === 'tr' ? 'Menüyü aç' : 'Open menu' }).click()
      expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([])
      await page.keyboard.press('Escape')
    }
  }
})

