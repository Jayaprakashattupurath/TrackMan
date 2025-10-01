const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up TrackMan application...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file from template');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('⚠️  env.example not found, creating basic .env file');
  
  const basicEnv = `# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
DATABASE_PATH=./data/trackman.db

# JWT Configuration
JWT_SECRET=trackman-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d

# Encryption
BCRYPT_ROUNDS=12`;

  fs.writeFileSync(envPath, basicEnv);
  console.log('✅ Created basic .env file');
}

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
} else {
  console.log('✅ Data directory already exists');
}

console.log('\n🎉 Setup complete! You can now run:');
console.log('   npm run dev     - Start development servers');
console.log('   npm run build   - Build for production');
console.log('   npm run start   - Start production servers');
console.log('\n📖 Check README.md for more information');
