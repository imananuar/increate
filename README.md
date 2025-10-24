# Increate Full-Stack Project

A full-stack application with Angular v20 frontend, NestJS backend, MySQL database, and TailwindCSS styling.

## Project Structure

```
increate/
├── frontend/          # Angular v20 application
├── backend/           # NestJS application
└── README.md
```

## Features

- **Frontend**: Angular v20 with TailwindCSS
- **Backend**: NestJS with TypeORM
- **Database**: MySQL
- **Authentication**: JWT-based authentication
- **UI Components**: Login, Register, Dashboard pages

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the template:
   ```bash
   cp env.template .env
   ```

4. Update the `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=increate_db
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   ```

5. Create the MySQL database:
   ```sql
   CREATE DATABASE increate_db;
   ```

6. Start the backend server:
   ```bash
   npm run start:dev
   ```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires authentication)

### Request/Response Examples

#### Register
```json
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response:
{
  "access_token": "jwt_token_here"
}
```

#### Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt_token_here"
}
```

## Frontend Pages

- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Protected dashboard page

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token is sent with subsequent requests
5. Backend validates token and returns protected data

## Technologies Used

### Frontend
- Angular v20
- TailwindCSS
- Angular Reactive Forms
- Angular Router
- Angular HTTP Client

### Backend
- NestJS
- TypeORM
- MySQL
- JWT Authentication
- Passport.js
- bcryptjs
- Class Validator

## Development

### Backend Development
```bash
cd backend
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Migrations
The application uses TypeORM's synchronize feature in development mode, which automatically creates/updates database tables based on entity definitions.

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Implement proper password policies
- Add rate limiting for authentication endpoints
- Use HTTPS in production

## Next Steps

- Add password reset functionality
- Implement user roles and permissions
- Add email verification
- Add more UI components
- Implement proper error handling
- Add unit and integration tests
