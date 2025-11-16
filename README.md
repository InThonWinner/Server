# KU Student Growth Assistant - Server

Backend API for the KU Student Growth Assistant application, built with NestJS, Prisma, and PostgreSQL (Supabase). This application provides personalized guidance for students through AI-powered chat, portfolio management, and community posts.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Student, Alumni, Admin)
- **User Management**: User registration, login, profile management with verification system
- **Portfolio Management**: Section-based portfolio updates (tech stack, career, projects, activities/awards, settings)
- **Community Posts**: Anonymous/non-anonymous posts with category filtering (Study Path, Course, Project, Career, etc.)
- **Chat System**: Chat sessions with message history for AI-powered conversations
- **AI Integration**: Integration with AI services for personalized student guidance
- **Swagger Documentation**: Interactive API documentation at `/api/docs`
- **Health Checks**: Service and database health monitoring endpoints

## Tech Stack

- **Framework**: NestJS 11
- **ORM**: Prisma 6.2.1
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT (Passport)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: class-validator & class-transformer
- **AI**: Google Generative AI

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (Supabase recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-jwt-secret-key"
PORT=3000
# Add other required environment variables
```

4. Run Prisma migrations:
```bash
npm run prisma:migrate
npm run prisma:generate
```

5. (Optional) Seed the database:
```bash
npm run prisma:seed
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`
Swagger documentation: `http://localhost:3000/api/docs`

### Production Build
```bash
npm run build
npm run start:prod
```

## API Overview

### Authentication
- `POST api/user/register` - Register a new user
- `POST api/user/login` - Login and get JWT token
- `POST api/user/logout` - Logout
- `GET  api/user/me` - Get current user profile (requires authentication)

### Portfolio
- `POST /portfolio` - Create your portfolio (requires authentication)
- `GET /portfolio/me` - Get your own portfolio (requires authentication)
- `GET /portfolio/user/:userId` - Get portfolio by user ID (public)
- `PATCH /portfolio/tech-stack` - Update tech stack section (requires authentication)
- `PATCH /portfolio/career` - Update career section (requires authentication)
- `PATCH /portfolio/projects` - Update projects section (requires authentication)
- `PATCH /portfolio/activities-awards` - Update activities/awards section (requires authentication)
- `PATCH /portfolio/contact` - Update portfolio contact (requires authentication)
- `PATCH /portfolio/affiliation` - Update portfolio affiliation (requires authentication)

### Posts
- `GET /posts` - Get all posts (with optional category filter and pagination)
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create a new post (requires authentication)
- `PATCH /posts/:id` - Update your post (requires authentication)
- `DELETE /posts/:id` - Delete your post (requires authentication)

### Chat
- `GET /chat/sessions` - Get all chat sessions (requires authentication)
- `POST /chat/sessions` - Create a new chat session (requires authentication)
- `GET /chat/sessions/:sessionid` - Get chat session with messages (requires authentication)
- `POST /chat/sessions/:id/messages` - Send a message in a chat session (requires authentication)
- `DELETE /chat/sessions/:sessionid` - Delete a chat session (requires authentication)
- `GET /chat/sessions/:sessionid/messages` - Get messages in a chat session (requires authentication)

### AI
- `POST /ai/chat` - Chat with AI assistant (requires authentication)


## Project Structure

```
src/
 ├── auth/              # Authentication module (JWT, guards, strategies)
 ├── user/              # User management module
 ├── portfolio/         # Portfolio management module
 │   └── dto/           # Portfolio DTOs (section-based updates)
 ├── post/              # Post management module
 │   └── dto/           # Post DTOs
 ├── chat/              # Chat session and message management
 │   └── dto/           # Chat DTOs
 ├── ai/                # AI integration module
 │   └── dto/           # AI DTOs
 ├── prisma/            # Prisma module and service
 ├── supabase/          # Supabase integration (storage)
 ├── config/            # Configuration module, env validation
 ├── common/            # Shared utilities
 │   ├── filters/       # HTTP exception filters
 │   ├── interceptors/  # Logging interceptors
 │   └── pipes/         # Validation pipes
 └── main.ts            # Application entry point
```

## Database Schema

The application uses Prisma ORM with the following main models:

- **User**: User accounts with roles (STUDENT, ALUMNI, ADMIN) and verification status
- **Portfolio**: User portfolios with section-based content (tech stack, career, projects, etc.)
- **Post**: Community posts with categories and anonymous/non-anonymous options
- **ChatSession**: Chat sessions for AI conversations
- **ChatMessage**: Messages within chat sessions

See `prisma/schema.prisma` for the complete schema definition.

## Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

You can obtain a token by logging in via `POST /auth/login`.

## Swagger Documentation

Interactive API documentation is available at `/api/docs` when the server is running. You can:
- View all available endpoints
- Test API calls directly from the browser
- See request/response schemas
- Authenticate using the "Authorize" button

## Environment Variables

Required environment variables (see `.env.example` for full list):

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct PostgreSQL connection string (for migrations)
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test your changes
4. Submit a pull request

## License

UNLICENSED
