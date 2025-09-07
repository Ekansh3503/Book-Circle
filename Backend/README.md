# BookCircle Backend API

A comprehensive Node.js backend API for a book sharing and management platform built with Express.js, Sequelize ORM, and PostgreSQL.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

BookCircle Backend is a RESTful API that powers a book sharing platform where users can:
- Join book clubs
- Add and manage books
- Borrow and lend books
- Track transactions
- Manage user profiles and club memberships

## ✨ Features

- **User Management**: Registration, authentication, profile management
- **Club Management**: Create and manage book clubs
- **Book Management**: Add, update, and categorize books
- **Transaction System**: Borrow/lend books with status tracking
- **Review System**: Rate and review books
- **Category & Language Support**: Organize books by categories and languages
- **Location Management**: Track book locations within clubs
- **Email Notifications**: Password reset and verification emails
- **File Upload**: Cloudinary integration for image uploads
- **JWT Authentication**: Secure API access with JSON Web Tokens

## 🛠 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **Environment**: dotenv
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **Docker** and **Docker Compose**
- **Git**

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://githome.heliossolutions.co:8052/nodejs/bookcircle-backend.git
cd bookcircle-backend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### Step 4: Database Setup with Docker

Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Start a PostgreSQL container on port 5433
- Create a persistent volume for data storage
- Set up the database with the configured credentials

### Step 5: Run Database Migrations

```bash
npx sequelize-cli db:migrate
```

### Step 6: Seed Sample Data (Optional)

```bash
node seedData.js
```

### Step 7: Start the Development Server

```bash
npm start
```

The server will start on `http://localhost:3000`

## ⚙️ Environment Configuration

Create a `.env` file with the following variables:

```env
# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_NAME=bookcircle
DB_HOST=localhost
DB_PORT=5433

# Application Settings
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random

# Email Configuration (Gmail)
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
```

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DB_USERNAME` | PostgreSQL username | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_HOST` | Database host (use `localhost` for local development) | Yes |
| `DB_PORT` | Database port (5433 for Docker setup) | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `FRONTEND_URL` | Frontend application URL for CORS | Yes |
| `PORT` | Server port | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `EMAIL_USER` | Gmail address for sending emails | Yes |
| `EMAIL_PASSWORD` | Gmail app password | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_SECRET_KEY` | Cloudinary secret key | Yes |

## 🗄️ Database Setup

### Using Docker (Recommended)

1. **Start the database**:
   ```bash
   docker-compose up -d
   ```

2. **Check container status**:
   ```bash
   docker ps
   ```

3. **View database logs**:
   ```bash
   docker-compose logs db
   ```

### Manual PostgreSQL Setup

If you prefer to install PostgreSQL manually:

1. Install PostgreSQL
2. Create a database named `bookcircle`
3. Update the `.env` file with your PostgreSQL credentials
4. Run migrations: `npx sequelize-cli db:migrate`

### Database Connection

The application connects to PostgreSQL using the following configuration:
- **Host**: localhost (or Docker container name `db`)
- **Port**: 5433 (Docker) or 5432 (local)
- **Database**: bookcircle
- **Username**: postgres
- **Password**: 1234

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Email verification

### Users
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/clubs` - Get user's clubs

### Clubs
- `GET /api/v1/club` - Get all clubs
- `POST /api/v1/club` - Create new club
- `GET /api/v1/club/:id` - Get club by ID
- `PUT /api/v1/club/:id` - Update club
- `DELETE /api/v1/club/:id` - Delete club

### Books
- `GET /api/v1/book` - Get all books
- `POST /api/v1/book` - Add new book
- `GET /api/v1/book/:id` - Get book by ID
- `PUT /api/v1/book/:id` - Update book
- `DELETE /api/v1/book/:id` - Delete book

### Transactions
- `GET /api/v1/transaction` - Get transactions
- `POST /api/v1/transaction` - Create transaction
- `PUT /api/v1/transaction/:id` - Update transaction

### Categories & Languages
- `GET /api/v1/category` - Get categories
- `POST /api/v1/category` - Create category
- `GET /api/v1/language` - Get languages
- `POST /api/v1/language` - Create language

## 📁 Project Structure

```
bookcircle-backend/
├── src/
│   ├── config/
│   │   ├── config.js          # Database configuration
│   │   ├── config.cjs         # CommonJS config for migrations
│   │   ├── db.js              # Database connection
│   │   └── nodemailer.js      # Email configuration
│   ├── controller/
│   │   ├── authController.js  # Authentication logic
│   │   ├── bookController.js  # Book management
│   │   ├── clubController.js  # Club management
│   │   ├── userController.js  # User management
│   │   └── ...
│   ├── middleware/
│   │   └── multer.js          # File upload middleware
│   ├── models/
│   │   ├── user.js            # User model
│   │   ├── club.js            # Club model
│   │   ├── book.js            # Book model
│   │   └── ...
│   ├── migrations/
│   │   └── *.cjs              # Database migrations
│   ├── Routes/
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── bookRoutes.js      # Book routes
│   │   └── ...
│   ├── utils/
│   │   ├── cloudinary.js      # File upload utility
│   │   └── dbConnect.js       # Database connection utility
│   └── jwt/
│       └── jwt.js             # JWT utilities
├── docker-compose.yml         # Docker configuration
├── .sequelizerc              # Sequelize configuration
├── package.json              # Dependencies
├── seedData.js               # Sample data script
└── index.js                  # Application entry point
```

## 🛠 Development

### Available Scripts

```bash
# Start development server
npm start

# Run database migrations
npx sequelize-cli db:migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo

# Check migration status
npx sequelize-cli db:migrate:status

# Create new migration
npx sequelize-cli migration:generate --name migration-name

# Seed sample data
node seedData.js
```

### Development Workflow

1. **Start the database**: `docker-compose up -d`
2. **Run migrations**: `npx sequelize-cli db:migrate`
3. **Start the server**: `npm start`
4. **Make changes** to your code
5. **Test endpoints** using Postman or curl
6. **Create new migrations** for database changes

### Code Structure Guidelines

- **Controllers**: Handle HTTP requests and responses
- **Models**: Define database schemas and relationships
- **Routes**: Define API endpoints and middleware
- **Middleware**: Custom middleware for authentication, validation, etc.
- **Utils**: Helper functions and utilities
- **Config**: Configuration files for database, email, etc.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
└── fixtures/       # Test data
```

## 🚀 Deployment

### Docker Deployment

1. **Build the image**:
   ```bash
   docker build -t bookcircle-backend .
   ```

2. **Run the container**:
   ```bash
   docker run -p 3000:3000 bookcircle-backend
   ```

### Production Environment

1. **Set environment variables** for production
2. **Use a production database** (not Docker)
3. **Configure reverse proxy** (nginx)
4. **Set up SSL certificates**
5. **Configure monitoring** and logging

### Environment-Specific Configurations

- **Development**: Uses Docker PostgreSQL, detailed logging
- **Production**: Uses managed PostgreSQL, optimized logging
- **Testing**: Uses in-memory database

## 📊 Database Schema

### Core Tables

- **users**: User accounts and profiles
- **clubs**: Book clubs and organizations
- **clubuser**: Many-to-many relationship between users and clubs
- **books**: Book information and metadata
- **transactions**: Book borrowing/lending records
- **categories**: Book categories
- **languages**: Supported languages
- **locations**: Physical book locations
- **reviews**: Book reviews and ratings

### Relationships

- Users can belong to multiple clubs
- Books belong to users and clubs
- Transactions link books, users, and clubs
- Books have categories and languages
- Books can have multiple reviews

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check if Docker container is running
   - Verify database credentials in `.env`
   - Ensure port 5433 is available

2. **Migration Errors**:
   - Check if all migrations are in `.cjs` format
   - Verify database is accessible
   - Run `npx sequelize-cli db:migrate:status`

3. **JWT Token Issues**:
   - Verify `JWT_SECRET` is set in `.env`
   - Check token expiration settings
   - Ensure proper token format in requests

4. **File Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper MIME types

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=sequelize:*
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Commit changes**: `git commit -m "Add new feature"`
7. **Push to branch**: `git push origin feature/new-feature`
8. **Create a Pull Request**

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - *Initial work* - [Helios Solutions](https://githome.heliossolutions.co)

## 🙏 Acknowledgments

- Express.js community for the excellent framework
- Sequelize team for the powerful ORM
- PostgreSQL community for the robust database
- All contributors who helped improve this project

## 📞 Support

For support and questions:

- **Email**: support@bookcircle.com
- **Documentation**: [API Documentation](docs/api.md)
- **Issues**: [GitHub Issues](https://githome.heliossolutions.co:8052/nodejs/bookcircle-backend/-/issues)

## 🔄 Changelog

### Version 1.0.0
- Initial release
- User authentication and management
- Club management system
- Book management and transactions
- Review and rating system
- Email notifications
- File upload with Cloudinary
- Docker support

## 🚀 Quick Start Summary

```bash
# 1. Clone and setup
git clone https://githome.heliossolutions.co:8052/nodejs/bookcircle-backend.git
cd bookcircle-backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start database
docker-compose up -d

# 4. Run migrations
npx sequelize-cli db:migrate

# 5. Seed sample data (optional)
node seedData.js

# 6. Start server
npm start
```

**Server will be running at:** `http://localhost:3000`

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    // Detailed error information
  ]
}
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: API rate limiting (configurable)
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection
- **XSS Protection**: Input sanitization and validation

## 📈 Performance Optimizations

- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Caching**: Redis caching (optional)
- **Compression**: Gzip compression for responses
- **Lazy Loading**: Efficient data loading strategies

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Remove all data (WARNING: This will delete all data)
docker-compose down -v
```

## 🔧 Environment Variables Reference

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | `development` | Environment mode |
| `PORT` | number | `3000` | Server port |
| `DB_HOST` | string | `localhost` | Database host |
| `DB_PORT` | number | `5433` | Database port |
| `DB_NAME` | string | `bookcircle` | Database name |
| `DB_USERNAME` | string | `postgres` | Database username |
| `DB_PASSWORD` | string | `1234` | Database password |
| `JWT_SECRET` | string | - | JWT signing secret |
| `FRONTEND_URL` | string | `http://localhost:5173` | Frontend URL for CORS |
| `EMAIL_USER` | string | - | Email service username |
| `EMAIL_PASSWORD` | string | - | Email service password |
| `CLOUDINARY_CLOUD_NAME` | string | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | string | - | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | string | - | Cloudinary secret key |

---

**Happy Coding! 🚀📚**