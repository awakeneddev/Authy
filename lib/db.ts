/* eslint-disable no-var, prefer-const */

import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Use global to prevent multiple connections in a serverless environment
declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  // if there is previous cache connection then it will return that connection
  if (cached.conn) return cached.conn;

  // if there is no connection even in promise, then setting new promise
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {})
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  global.mongoose = cached; // Store connection globally
  return cached.conn;
}

export default dbConnect;