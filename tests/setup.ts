import { config } from 'dotenv'
import { existsSync } from 'fs'
if (existsSync('.env.test')) config({ path: '.env.test' })
else if (existsSync('.env.local')) config({ path: '.env.local' })
