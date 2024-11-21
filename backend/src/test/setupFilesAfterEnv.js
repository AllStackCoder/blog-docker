import { beforeAll, afterAll } from '@jest/globals'
import { initDatabase } from '../db/init'
import mongoose from 'mongoose'

beforeAll(async () => {
  await initDatabase()
})
afterAll(async () => {
  await mongoose.disconnect()
})
