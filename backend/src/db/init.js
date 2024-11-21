import mongoose from 'mongoose'

export async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL
  mongoose.connection.on(
    'open',
    () => {
      console.info('Database connected successfully:', DATABASE_URL)
    },
    DATABASE_URL,
  )
  const connection = await mongoose.connect(DATABASE_URL)
  return connection
}
