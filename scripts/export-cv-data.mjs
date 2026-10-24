import { mkdir, writeFile } from 'node:fs/promises'
import { portfolio } from '../src/data/portfolio.ts'
await mkdir('.tmp', { recursive: true })
await writeFile('.tmp/cv-data.json', JSON.stringify(portfolio, null, 2))
console.log('CV data exported from src/data/portfolio.ts')
