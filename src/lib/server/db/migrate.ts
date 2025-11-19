import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 
  'postgresql://doadmin:AVNS_GUQCIg9T0u45BV-7CyN@webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com:25060/defaultdb?sslmode=require';

async function migrate() {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Starting database migration...');
    
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/server/db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users');
    console.log('   - products');
    console.log('   - orders');
    console.log('   - order_items');
    console.log('   - cart_items');
    console.log('   - sessions');
    console.log('🎉 Sample products and admin user inserted!');
    console.log('👤 Admin credentials: admin@storehub.com / admin123');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

export default migrate;