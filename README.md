# Coworking Manager

Comprehensive management system for coworking spaces with IoT control.

## Key Features
- 🏢 Space and booking management
- 👥 User and membership administration
- 💡 IoT lighting control via Raspberry Pi
- 📊 Occupancy dashboard and analytics
- 💰 Billing and payment system
- 🔐 Automated access control

## Tech Stack
- Frontend: TypeScript + Vite
- Backend: Node.js + Express
- Database: PostgreSQL
- IoT: Raspberry Pi + GPIO
- Authentication: JWT

## IoT Features
- Remote lighting control per space
- Booking-based automation
- Energy consumption monitoring
- Presence sensor integration

## Setup
1. Install dependencies: `npm install`
2. Copy .env.example to .env in both frontend and backend
3. Configure your database in backend/.env
4. Run development: `npm run dev`

## Scripts
- `npm run dev`: Start both frontend and backend in development mode
- `npm run build`: Build both projects
- `npm run start`: Start production server
- `npm run test`: Run tests
- `npm run test:ui`: Run tests with Vitest UI
