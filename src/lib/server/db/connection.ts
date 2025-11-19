import pg from 'pg';

const { Pool } = pg;

// Create a connection pool
export const pool = new Pool({
  user: process.env.DATABASE_USER || 'doadmin',
  password: process.env.DATABASE_PASSWORD || 'AVNS_GUQCIg9T0u45BV-7CyN',
  host: process.env.DATABASE_HOST || 'webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com',
  port: parseInt(process.env.DATABASE_PORT || '25060'),
  database: process.env.DATABASE_NAME || 'defaultdb',
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection function
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected successfully at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Query helper function with error handling
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result.rows;
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
}

// Transaction helper
export async function transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;