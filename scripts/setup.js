#!/usr/bin/env node

/**
 * StoreHub Setup Script
 * 
 * This script helps set up the StoreHub application for development or production.
 * Run with: node scripts/setup.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 StoreHub Setup Script\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 20) {
  console.error('❌ Node.js version 20.19+ or 22.12+ is required');
  console.error(`❌ You have: ${nodeVersion}`);
  process.exit(1);
} else {
  console.log(`✅ Node.js version: ${nodeVersion}`);
}

// Check if package.json exists
if (!fs.existsSync(path.join(rootDir, 'package.json'))) {
  console.error('❌ package.json not found. Make sure you are in the correct directory.');
  process.exit(1);
}

console.log('✅ package.json found');

// Check if .env file exists
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📝 Creating .env file from .env.example');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created');
    console.log('⚠️  Please update the .env file with your database credentials');
  } else {
    console.error('❌ Neither .env nor .env.example found');
    process.exit(1);
  }
} else {
  console.log('✅ .env file exists');
}

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies');
  process.exit(1);
}

// Check database configuration
console.log('\n🔍 Checking database configuration...');
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredEnvVars = [
  'DATABASE_USER',
  'DATABASE_PASSWORD', 
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !envContent.includes(`${varName}=`));

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing environment variables:');
  missingEnvVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('⚠️  Please add these to your .env file');
} else {
  console.log('✅ All required environment variables are present');
}

// Database migration prompt
console.log('\n🗄️  Database Setup');
const readline = await import('readline').then(m => m.default);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const migrateDb = await new Promise(resolve => {
  rl.question('Would you like to run database migration now? (y/N): ', (answer) => {
    resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    rl.close();
  });
});

if (migrateDb) {
  console.log('🔄 Running database migration...');
  try {
    execSync('node scripts/migrate.js', { stdio: 'inherit' });
    console.log('✅ Database migration completed');
    
    // Create admin user
    const createAdmin = await new Promise(resolve => {
      const rl2 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl2.question('Would you like to create an admin user? (y/N): ', (answer) => {
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        rl2.close();
      });
    });
    
    if (createAdmin) {
      console.log('👤 Creating admin user...');
      execSync('node scripts/create-admin.js', { stdio: 'inherit' });
      console.log('✅ Admin user created');
    }
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    console.log('💡 Make sure your database is running and credentials are correct');
  }
}

console.log('\n🎉 Setup completed!');
console.log('\nNext steps:');
console.log('1. Start development server: npm run dev');
console.log('2. Visit http://localhost:5173');
console.log('3. For deployment instructions, see DEPLOYMENT.md');

if (missingEnvVars.length > 0) {
  console.log('\n⚠️  Don\'t forget to update your .env file with proper credentials before deploying!');
}