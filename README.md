# TrackMan - Personal Activity Tracker

A comprehensive personal tracking application built with Next.js, React, Tailwind CSS, Node.js, Express.js, and SQLite. Track your daily activities, manage tasks, monitor health, and boost productivity with professional-grade tools.

## ✨ Recent Updates

### 🎨 UI Framework Migration (Latest)
- **Removed Chakra UI** completely from the project
- **Migrated to Tailwind CSS** for modern utility-first styling
- **Added Heroicons** for beautiful, consistent SVG icons
- **Improved performance** with smaller bundle size
- **Better developer experience** with Tailwind's utility classes
- **Enhanced accessibility** with better semantic HTML

### 🔧 Technical Improvements
- **Faster build times** without heavy UI library dependencies
- **More control** over component styling and customization
- **Consistent design system** with Tailwind's design tokens
- **Better responsive design** with mobile-first approach
- **Cleaner component code** with utility classes

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd TrackMan/trackman-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp server/env.example server/.env

# Or run the setup script
node setup.js
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Frontend only (port 3000)
npm run client:dev

# Backend only (port 3001)
npm run server:dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 📋 Detailed Setup Guide

### Step 1: Project Structure
Ensure you have the following structure:
```
TrackMan/
├── trackman-app/              # Main application directory
│   ├── src/                   # Frontend source
│   ├── server/                # Backend source
│   ├── public/                # Static assets
│   ├── package.json           # Dependencies
│   └── setup.js              # Setup script
```

### Step 2: Install All Dependencies
The application uses several key packages:

**Frontend Dependencies:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `tailwindcss` - Utility-first CSS framework
- `@heroicons/react` - Beautiful SVG icons
- `clsx` & `tailwind-merge` - CSS class management

**Backend Dependencies:**
- `express` - Web framework
- `better-sqlite3` - Database
- `bcryptjs` - Password hashing
- `jsonwebtoken` - Authentication
- `cors` - Cross-origin requests
- `helmet` - Security headers

**Development Dependencies:**
- `typescript` - Type safety
- `nodemon` - Development server
- `concurrently` - Run multiple scripts
- `eslint` - Code linting

### Step 3: Environment Configuration

Create `server/.env` file with the following content:
```env
# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration
DATABASE_PATH=./data/trackman.db

# JWT Configuration
JWT_SECRET=trackman-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d

# Encryption
BCRYPT_ROUNDS=12
```

**Important Notes:**
- Change `JWT_SECRET` to a strong, random string in production
- Ensure `DATABASE_PATH` points to where you want the SQLite file
- `CLIENT_URL` should match your frontend URL

### Step 4: Database Setup

The application automatically creates the database and tables on first run. The database will be created at the path specified in `DATABASE_PATH`.

**Database Schema:**
- **users** - User accounts and authentication
- **activities** - Daily activity tracking
- **tasks** - Task management
- **health_entries** - Health metrics (future)
- **work_entries** - Work tracking (future)
- **goals** - Personal goals (future)
- **habits** - Habit tracking (future)

### Step 5: Start the Application

#### Option A: Start Both Servers (Recommended)
```bash
npm run dev
```
This command starts both the frontend (Next.js) and backend (Express) servers simultaneously.

#### Option B: Start Servers Individually
```bash
# Terminal 1 - Backend Server
npm run server:dev

# Terminal 2 - Frontend Server
npm run client:dev
```

### Step 6: Verify Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"OK","timestamp":"..."}`

2. **Access Frontend:**
   Open http://localhost:3000 in your browser

3. **Test Database:**
   The database file should be created in `server/data/trackman.db`

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run client:dev` | Start only the Next.js frontend (port 3000) |
| `npm run server:dev` | Start only the Express backend (port 3001) |
| `npm run build` | Build the application for production |
| `npm run start` | Start the application in production mode |
| `npm run lint` | Run ESLint for code quality |
| `npm run type-check` | Run TypeScript type checking |

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server with hot reload
- **Concurrently** - Run multiple development servers
- **TypeScript** - Static type checking

## 🔧 Development Workflow

### 1. Frontend Development
- **Location**: `src/` directory
- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS utility classes
- **Icons**: Heroicons SVG icon library
- **Language**: TypeScript

### 2. Backend Development
- **Location**: `server/` directory
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Language**: TypeScript

### 3. API Development
- **Routes**: `server/routes/` directory
- **Models**: `server/models/` directory
- **Middleware**: `server/middleware/` directory

## 📱 Application Features

### ✅ Currently Available
- **Dashboard**: Overview of activities and tasks with modern Tailwind UI
- **Activity Tracking**: Log daily activities with categories, duration, and location
- **Task Management**: Create, organize, and track tasks with priorities and due dates
- **User Authentication**: Secure registration and login system
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with Heroicons and Tailwind CSS

### 🔄 Coming Soon
- **Health & Fitness**: Workout logging, nutrition tracking, sleep monitoring
- **Work & Productivity**: Time tracking, project management, billable hours
- **Data Visualization**: Charts, graphs, and analytics
- **Reporting**: Export data and generate reports

## 🗄️ Database Management

### Database Location
- **Development**: `server/data/trackman.db`
- **Production**: Path specified in `DATABASE_PATH` environment variable

### Database Operations
The application handles database operations automatically:
- **Initialization**: Tables created on first run
- **Migrations**: Schema updates handled by the application
- **Backups**: Manual backup of the SQLite file

### Manual Database Access
```bash
# Install SQLite CLI (if not installed)
# Windows: Download from sqlite.org
# macOS: brew install sqlite
# Linux: apt-get install sqlite3

# Access database
sqlite3 server/data/trackman.db

# Common commands
.tables          # List all tables
.schema users    # Show table schema
SELECT * FROM users;  # Query data
```

## 🔐 Authentication System

### User Registration
1. Navigate to the application
2. Click "Get Started" or "Sign Up"
3. Provide email, name, and password
4. Account created automatically

### User Login
1. Use registered credentials
2. JWT token stored in browser
3. Automatic authentication for API calls

### Password Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- Secure session management

## 🚀 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Set Production Environment
```env
NODE_ENV=production
JWT_SECRET=your-strong-production-secret
DATABASE_PATH=/var/lib/trackman/trackman.db
CLIENT_URL=https://your-domain.com
```

### 3. Start Production Servers
```bash
npm run start
```

### 4. Process Management (Recommended)
Use PM2 for process management:
```bash
npm install -g pm2
pm2 start npm --name "trackman" -- start
pm2 startup
pm2 save
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process using port 3000
npx kill-port 3000

# Kill process using port 3001
npx kill-port 3001
```

#### 2. Database Permission Issues
```bash
# Ensure data directory exists and is writable
mkdir -p server/data
chmod 755 server/data
```

#### 3. Node Modules Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. TypeScript Errors
```bash
# Run type checking
npm run type-check

# Check TypeScript configuration
npx tsc --showConfig
```

### Logs and Debugging

#### Backend Logs
```bash
# View server logs
npm run server:dev

# Check database logs
tail -f server/data/trackman.db.log
```

#### Frontend Logs
```bash
# View Next.js logs
npm run client:dev

# Check browser console for errors
```

## 📊 Monitoring

### Health Checks
- **Backend**: `GET /api/health`
- **Database**: Automatic connection testing
- **Frontend**: Next.js built-in health monitoring

### Performance Monitoring
- **Response Times**: Monitor API endpoint performance
- **Database Queries**: Optimize slow queries
- **Memory Usage**: Monitor Node.js memory consumption

## 🔄 Updates and Maintenance

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update specific packages
npm install package@latest
```

### Database Maintenance
```bash
# Backup database
cp server/data/trackman.db backup/trackman-$(date +%Y%m%d).db

# Optimize database
sqlite3 server/data/trackman.db "VACUUM;"
```

## 📞 Support

### Getting Help
1. **Check this README** for common solutions
2. **Review logs** for error messages
3. **Check GitHub issues** for known problems
4. **Create an issue** with detailed information

### Useful Commands
```bash
# Check application status
npm run type-check
npm run lint

# Reset database (development only)
rm server/data/trackman.db

# View application info
npm list --depth=0
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and Tailwind CSS
- Modern utility-first styling with Heroicons
- Database design inspired by modern productivity apps
- UI/UX patterns from leading tracking applications

---

**TrackMan** - Take control of your day, one activity at a time. 🎯

For detailed technical implementation, see [IMPLEMENTATION.md](./IMPLEMENTATION.md)