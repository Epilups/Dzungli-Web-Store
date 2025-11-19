import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;

async function createAdmin() {
  const pool = new Pool({
    user: 'doadmin',
    password: 'AVNS_GUQCIg9T0u45BV-7CyN',
    host: 'webshop-postgresql-fra1-43263-do-user-13924298-0.g.db.ondigitalocean.com',
    port: 25060,
    database: 'defaultdb',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔐 Creating admin user with proper password hash...');
    
    // Generate proper bcrypt hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    // Insert or update admin user
    await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_admin) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) 
       DO UPDATE SET password_hash = $2, is_admin = $5`,
      ['admin@storehub.com', passwordHash, 'Admin', 'User', true]
    );
    
    console.log(' Admin user created successfully!');
    console.log('');
    console.log(' Email: admin@storehub.com');
    console.log(' Password: admin123');
    console.log('');
    console.log(' Login at: http://localhost:5173/account');
    console.log(' Admin panel at: http://localhost:5173/admin');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();