
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'designflow_db'; // You can make the DB name configurable

// A function to check if the database should be used.
export function isDbEnabled(): boolean {
  return !!MONGODB_URI;
}

if (!MONGODB_URI) {
  console.warn(
    'MONGODB_URI is not defined. Database operations will be disabled, and the app will use mock data.'
  );
}

interface CachedMongoConnection {
  client: MongoClient | null;
  db: Db | null;
}

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
// In production mode, it's best to not use a global variable.
let cachedConnection: CachedMongoConnection | null = null;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = null;
  }
  cachedConnection = global._mongoClientPromise as CachedMongoConnection | null;
}


export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If the DB is not enabled, throw an error to prevent connection attempts.
  if (!isDbEnabled() || !MONGODB_URI) {
    throw new Error('Database is not enabled. Check MONGODB_URI.');
  }

  if (cachedConnection && cachedConnection.client && cachedConnection.db) {
    // Check if the client is connected
    try {
      // Ping the database to check connection status
      await cachedConnection.client.db("admin").command({ ping: 1 });
      return cachedConnection as { client: MongoClient; db: Db };
    } catch (e) {
      // Connection lost, reset cache and reconnect
      cachedConnection.client = null;
      cachedConnection.db = null;
    }
  }

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    if (process.env.NODE_ENV === 'development') {
      global._mongoClientPromise = { client, db };
      cachedConnection = global._mongoClientPromise as CachedMongoConnection;
    } else {
      cachedConnection = { client, db };
    }
    
    return { client, db };

  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    // If connection fails, ensure the client is closed
    await client.close();
    throw e; // Re-throw the error after logging and cleanup
  }
}

// Extend the NodeJS.Global interface for development HMR
declare global {
  var _mongoClientPromise: CachedMongoConnection | null;
}
