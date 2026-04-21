# Zentry Nexus

**Identity Access Management Cockpit** - A modern, secure, and scalable IAM system built with Next.js and React.

![Status](https://img.shields.io/badge/status-active-success)
![Node](https://img.shields.io/badge/node-v18+-green)
![Next.js](https://img.shields.io/badge/Next.js-16.2+-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

Zentry Nexus is a comprehensive Identity Access Management (IAM) platform designed for system administrators and security teams. It provides centralized control over user authentication, authorization, and audit management with an intuitive, modern interface.

### Key Features

- 🔐 **User Authentication** - Secure login with JWT-based authentication
- 👥 **User Management** - Admin panel for user creation, deletion, and status management
- 🔑 **Role-Based Access Control (RBAC)** - Granular permission management
- 📊 **System Overview** - Dashboard displaying identity protocol, active roles, and permissions
- 📋 **Audit Ledger** - Track and monitor all system activities (admin only)
- 🎨 **Modern UI** - Dark theme with smooth animations and responsive design
- 📱 **Responsive** - Works seamlessly on desktop and mobile devices
- 🔒 **Security** - Protected admin routes with role verification

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript
- **Styling**: Tailwind CSS 4, Shadcn UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## Project Structure

```
zentry-nexus/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (redirects to dashboard)
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── dashboard/
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── page.tsx         # System overview
│   │       └── audit/
│   │           └── page.tsx     # Audit ledger (admin only)
│   ├── components/
│   │   ├── Sidebar.tsx          # Main navigation sidebar
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── api-client.ts        # Axios client configuration
│   │   └── utils.ts             # Utility functions
│   └── store/
│       └── useAuth.ts           # Zustand auth store
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd zentry-nexus
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Run the development server
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Features Explained

### Dashboard
The main dashboard displays:
- **Identity Protocol** - Current user information (ID, username, email)
- **Active Roles** - Assigned user roles and clearance levels
- **Cryptographic Permissions** - Granular access control permissions
- **Registered Users** (Admin only) - System user directory with management controls

### Sidebar Navigation
- **System Overview** - Dashboard home page
- **Audit Ledger** - Activity logs (admin only)
- User profile with role indicators
- Secure logout functionality

### User Management (Admin Only)
- View all registered users
- Search users by username or email
- Toggle user account lock status
- Real-time UI updates

## Authentication Flow

1. User logs in with credentials
2. JWT token is issued and stored in cookies
3. Token is validated on protected routes
4. User context is managed via Zustand store
5. Role-based access controls enforce permissions

## Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Other Platforms
The project is built with Next.js and can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Docker containers
- Traditional Node.js hosting

## Security Considerations

- All admin routes require `ROLE_ADMIN` role
- Passwords should be hashed on the backend
- JWT tokens should have appropriate expiration times
- HTTPS should be enforced in production
- CORS policies should be properly configured
- Rate limiting recommended on auth endpoints

## API Integration

The project expects a backend API at `NEXT_PUBLIC_API_URL` with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - User logout

### Admin
- `GET /admin/users` - List all users
- `PATCH /admin/users/:id/toggle-lock` - Lock/unlock user account


---

**Made with ❤️ by the Shizain and Anish**

