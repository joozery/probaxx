import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error('MONGODB_URI is not defined')

// Reuse connection across hot-reloads in dev
const globalWithMongoose = global as typeof globalThis & {
  _mongooseConn: Promise<typeof mongoose> | null
}

if (!globalWithMongoose._mongooseConn) {
  globalWithMongoose._mongooseConn = null
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return
  if (globalWithMongoose._mongooseConn) return globalWithMongoose._mongooseConn

  globalWithMongoose._mongooseConn = mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  })

  return globalWithMongoose._mongooseConn
}
