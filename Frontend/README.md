# BookCircle Frontend

A modern React-based frontend application for the BookCircle book sharing platform, built with Vite, Redux, and modern web technologies.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Deployment](#deployment)

## 🎯 Overview

BookCircle Frontend is a responsive web application that provides an intuitive interface for users to:
- Join and manage book clubs
- Add, browse, and search books
- Borrow and lend books within clubs
- Track book transactions
- Manage user profiles and preferences
- Review and rate books

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with intuitive navigation
- **User Authentication**: Secure login and registration system
- **Club Management**: Create, join, and manage book clubs
- **Book Management**: Add, edit, and organize personal book collections
- **Transaction System**: Borrow and lend books with status tracking
- **Search & Filter**: Advanced book search with multiple filters
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live updates for book availability and transactions

## 🛠 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: CSS3 with modern features
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git**

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ekansh3503/Book-Circle.git
cd ../Frontend
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

Update the `.env` file with your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:3000/
```

### Step 4: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🛠 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 📁 Project Structure

```
Frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/              # Static assets (images, icons)
│   │   ├── clubLogo.png
│   │   ├── Logo.png
│   │   └── profile.png
│   ├── components/          # Reusable UI components
│   │   ├── BookDetails/     # Book detail components
│   │   ├── Databox/         # Data display components
│   │   ├── Dialogs/         # Modal dialogs
│   │   ├── Dropdowns/       # Dropdown components
│   │   ├── Footer/          # Footer component
│   │   ├── Forms/           # Form components
│   │   ├── Header/          # Header and navigation
│   │   ├── Listing/         # List and grid components
│   │   ├── Pagination/      # Pagination component
│   │   └── Sidebar/         # Sidebar component
│   ├── hooks/               # Custom React hooks
│   │   ├── useInitializeSession.js
│   │   ├── useSelectAllClubs.js
│   │   ├── useSelectClub.js
│   │   └── useUsers.js
│   ├── pages/               # Page components
│   │   ├── Auth/            # Authentication pages
│   │   ├── ClubAdmin/       # Club administration
│   │   ├── Common/          # Shared pages
│   │   ├── SuperAdmin/      # Super admin pages
│   │   └── User/            # User pages
│   ├── redux/               # Redux store and slices
│   │   ├── slices/
│   │   │   └── clubSession/
│   │   └── store.js
│   ├── services/            # API service functions
│   │   ├── authService.js
│   │   ├── bookService.js
│   │   ├── clubService.js
│   │   ├── userService.js
│   │   └── ...
│   ├── App.jsx              # Main App component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── .gitignore
├── eslint.config.js         # ESLint configuration
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── sonar-project.properties # SonarQube configuration
├── vite.config.js           # Vite configuration
└── README.md
```

## 🔌 API Integration

The frontend communicates with the BookCircle backend API through service functions:

### Authentication Services
- User login and registration
- Password reset and verification
- Session management

### Book Services
- Book CRUD operations
- Book search and filtering
- Book borrowing and lending

### Club Services
- Club management
- Member management
- Club settings

### User Services
- Profile management
- User preferences
- Activity tracking

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Static Hosting

The built files can be deployed to any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect your repository
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload the `dist` folder

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
VITE_APP_NAME=BookCircle
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API service and Redux tests
- **E2E Tests**: End-to-end user flow tests

## 🎨 Styling Guidelines

- Use CSS modules or styled-components for component-specific styles
- Follow BEM methodology for CSS class naming
- Use CSS custom properties for theming
- Ensure responsive design for all screen sizes
- Follow accessibility guidelines (WCAG 2.1)

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` file contains:
- React plugin configuration
- Build optimizations
- Development server settings
- Proxy configuration for API calls

### ESLint Configuration

The `eslint.config.js` file includes:
- React-specific rules
- JavaScript best practices
- Code formatting rules
- Import/export rules

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding! 🚀📚**
