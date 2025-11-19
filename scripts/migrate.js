import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

async function migrate() {
  const pool = new Pool({
    user: process.env.DATABASE_USER || 'doadmin',
    password: process.env.DATABASE_PASSWORD || 'AVNS_GUQCIg9T0u45BV-7CyN',
    host: process.env.DATABASE_HOST || 'webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com',
    port: parseInt(process.env.DATABASE_PORT || '25060'),
    database: process.env.DATABASE_NAME || 'defaultdb',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔄 Starting database migration...');
    
    const schemaPath = path.join(process.cwd(), 'src/lib/server/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created: users, products, orders, order_items, cart_items, sessions');
    console.log('🎉 Sample products and admin user inserted!');
    console.log('👤 Admin credentials: admin@storehub.com / admin123');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

migrate().then(() => {
  console.log('Migration complete!');
  process.exit(0);
}).catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});