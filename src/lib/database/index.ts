import mongoose from 'mongoose';

const { MONGODB_URI } = process.env;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable',
    );
  }

  if (!cached.promise) {
    const db = mongoose.connect(MONGODB_URI, {
      dbName: 'evently',
      bufferCommands: false,
    });

    cached.promise = db;
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
