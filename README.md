# Bozhidar Estate

Bozhidar Estate is a real estate website where users can publish, remove, edit, and check apartments and houses based on various criteria from other users.

## Description
Bozhidar Estate is designed to facilitate real estate transactions. Users can publish new listings, edit or remove their listings, and search for properties that match their criteria.

## Installation
To set up the project locally, follow these steps:

### Prerequisites
- Node.js
- MongoDB

### Steps
1. Install server dependencies and start the server:
   ```bash
   cd api
   npm install
   npm run start

2. Install client dependencies and start the client:
   ```bash
   cd client
   npm install
   npm run build
   npm run dev

### Features
List the main features of your project here. For example:

User authentication and authorization
Property listings with detailed information
Search functionality with various filters
Add, edit, and remove property listings
User profile management
Responsive design

## Technologies Used
- **Frontend**:
  - React
  - Redux
  - i18next
  - Swiper
  - Tailwind CSS
  - Vite
- **Backend**:
  - Node.js
  - Express
  - Mongoose
- **Other**:
  - Firebase
  - bcrypt
  - cookie-parser
  - dotenv
  - express-validator
  - http-status-codes
  - jsonwebtoken
  - nodemailer

## API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user (requires authentication)
- `POST /api/user/login` - Login a user (requires authentication)
- `POST /api/user/google` - Google login (requires authentication)
- `GET /api/user/logout` - Logout
- `POST /api/user/forgot-password` - Forgot Password
- `POST /api/user/reset-password/:token` - Reset Password
- `POST /api/user/update/:id` - Update user details (requires authentication)
- `DELETE /api/user/delete/:id` - Delete user (requires authentication)
- `GET /api/user/properties/:id` - Get user properties (requires authentication)
- `GET /api/user/:id` - Get user details (requires authentication)
- `POST /api/user/contact` - Send Contact Mail

### Property Routes
- `POST /api/property/add` - Add new property (requires token verification)
- `DELETE /api/property/delete/:id` - Delete property by ID (requires token verification)
- `POST /api/property/edit/:id` - Edit property by ID (requires token verification)
- `GET /api/property/get/:id` - Get a property by ID
- `GET /api/property/get` - Search properties