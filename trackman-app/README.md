# TrackMan - Personal Activity Tracker

A comprehensive personal tracking application built with Next.js, React, Chakra UI, Node.js, Express.js, and SQLite.

## 🚀 Features

### ✅ Implemented
- **Dashboard**: Overview of daily activities, tasks, and progress
- **Activity Tracking**: Log and manage daily activities with categories, duration, and location
- **Task Management**: Create, organize, and track tasks with priorities, due dates, and status
- **Responsive UI**: Beautiful, modern interface using Chakra UI
- **Authentication System**: Secure user registration and login with JWT
- **Database**: SQLite database with comprehensive schema design
- **API**: RESTful API endpoints for all CRUD operations

### 🔄 Coming Soon
- **Health & Fitness Tracking**: Workout logging, nutrition tracking, sleep monitoring
- **Work & Productivity**: Time tracking, project management, billable hours
- **Data Visualization**: Charts, graphs, and analytics
- **Reporting**: Export data and generate reports
- **Mobile App**: React Native mobile application

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Chakra UI** - Component library
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Nodemon** - Development server
- **Concurrently** - Run multiple scripts

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trackman-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp server/env.example server/.env
   ```
   Edit `server/.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   DATABASE_PATH=./data/trackman.db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   BCRYPT_ROUNDS=12
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the frontend (port 3000) and backend (port 3001) servers.

## 🏃‍♂️ Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run client:dev` - Start only the frontend development server
- `npm run server:dev` - Start only the backend development server
- `npm run build` - Build the application for production
- `npm run start` - Start the application in production mode
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📊 Database Schema

The application uses SQLite with the following main tables:

- **users** - User accounts and preferences
- **activities** - Daily activities and routines
- **tasks** - Task management with priorities and due dates
- **health_entries** - Health and fitness tracking (coming soon)
- **work_entries** - Work and productivity tracking (coming soon)
- **goals** - Personal goals and targets
- **habits** - Habit tracking and completions

## 🔐 Authentication

The application uses JWT-based authentication with:
- Secure password hashing using bcrypt
- JWT tokens with configurable expiration
- Protected API routes
- User session management

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Modern Interface**: Clean, professional design
- **Intuitive Navigation**: Easy-to-use navigation system
- **Real-time Updates**: Instant feedback and updates
- **Accessibility**: WCAG compliant components

## 📱 Pages & Features

### Dashboard (`/dashboard`)
- Overview of daily activities and progress
- Quick stats and metrics
- Recent activities and task progress
- Quick actions and alerts

### Activities (`/activities`)
- Log daily activities with details
- Category-based organization
- Duration and location tracking
- Tag system for better organization

### Tasks (`/tasks`)
- Create and manage tasks
- Priority and due date management
- Status tracking (pending, in progress, completed)
- Progress visualization

### Health (`/health`) - Coming Soon
- Workout logging and tracking
- Nutrition and meal planning
- Sleep quality monitoring
- Health metrics and goals

### Work (`/work`) - Coming Soon
- Time tracking and project logging
- Billable hours and invoicing
- Meeting and appointment scheduling
- Productivity analytics

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm run start
```

### Environment Variables
Make sure to set the following environment variables in production:
- `NODE_ENV=production`
- `JWT_SECRET` - A strong, random secret key
- `DATABASE_PATH` - Path to your SQLite database file
- `CLIENT_URL` - Your frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with ❤️ using Next.js and Chakra UI
- Database design inspired by modern productivity apps
- UI/UX patterns from leading tracking applications

## 📞 Support

For support, email support@trackman-app.com or create an issue in the repository.

---

**TrackMan** - Take control of your day, one activity at a time. 🎯