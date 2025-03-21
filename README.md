# Express Mongo TypeScript REST API Starter

A **starter template** for building RESTful APIs using **Express.js**, **MongoDB**, **Mongoose** and **TypeScript**. This project provides a pre-configured project structure with best practices, allowing you to focus on writing your business logic.

## 🚀 Features & Best Practices

- ✅ **Layered architecture** (controllers, services, models, middlewares, schemas).
- ✅ **Strict TypeScript usage** for type safety.
- ✅ **Environment variable management** using `dotenv`.
- ✅ **Security best practices** (CORS, Helmet, etc.).
- ✅ **Centralized error handling middleware** for cleaner code.
- ✅ **Production-ready folder structure** for scalability.
- ✅ **Pre-configured logging** using Winston.
- ✅ **Validation middleware** for request validation.
- ✅ **ESLint & Prettier** configured for consistent code style.
- ✅ **Easier development with Nodemon** automatically restarting the application when changes are detected.

## 📂 Project Structure

```
📦 emt-rest-api
 ┣ 📂 logs                    # Application log files
 ┣ 📂 src                     # Project source folder
 ┃ ┣ 📂 config                # Project configuration files
 ┃ ┃ ┣ 📜 env.config.ts
 ┃ ┃ ┗ 📜 logger.config.ts
 ┃ ┣ 📂 exceptions            # Exception response classes
 ┃ ┃ ┣ 📜 apiError.ts
 ┃ ┃ ┣ 📜 forbiddenError.ts
 ┃ ┃ ┣ 📜 notFoundError.ts
 ┃ ┃ ┗ 📜 unauthorizedError.ts
 ┃ ┣ 📂 controllers           # Handle request and business logic implementation
 ┃ ┃ ┣ 📜 user.controller.ts
 ┃ ┃ ┗ 📜 auth.controller.ts
 ┃ ┣ 📂 middlewares           # Reusable middlewares
 ┃ ┃ ┣ 📜 auth.middleware.ts
 ┃ ┃ ┣ 📜 errorHandler.middleware.ts
 ┃ ┃ ┗ 📜 validate-resources.middleware.ts
 ┃ ┣ 📂 models                # Defines Mongoose schemas and models
 ┃ ┃ ┣ 📜 user.model.ts
 ┃ ┃ ┗ 📜 session.model.ts
 ┃ ┣ 📂 routes                # Route definitions
 ┃ ┃ ┣ 📜 user.routes.ts
 ┃ ┃ ┣ 📜 auth.routes.ts
 ┃ ┃ ┗ 📜 index.ts
 ┃ ┣ 📂 schemas               # Zod schemas for handling validation
 ┃ ┃ ┣ 📜 user.schema.ts
 ┃ ┣ 📂 services              # Handle business logic related things here
 ┃ ┃ ┣ 📜 auth.service.ts
 ┃ ┃ ┣ 📜 user.service.ts
 ┃ ┣ 📂 utils                 # Utility/helper functions
 ┃ ┣ 📜 app.ts                # Express App Setup
 ┃ ┗ 📜 server.ts             # Server Entry Point
 ┣ 📜 .env                    # Environment variables
 ┣ 📜 .gitignore              # Git ignored files
 ┣ 📜 package.json            # Project dependencies
 ┣ 📜 tsconfig.json           # TypeScript configuration
 ┗ 📜 README.md               # Project documentation
```

## 🛠 Installation & Setup

### 1️⃣ Prerequisites

Make sure you have the following installed:

- **Node.js** (>=18.x)
- **MongoDB** (running locally or via a cloud provider)

### 2️⃣ Clone the repository

```sh
git clone https://github.com/Kei-K23/express-mongo-typescript-starter.git
cd express-mongo-typescript-starter
rm -rf .git # Remove the .git folder and init your own .git
git init
```

### 3️⃣ Install dependencies

```sh
npm install
# or
pnpm install
```

### 4️⃣ Set up environment variables

Rename `.env.example` to `.env` and update the values accordingly:

### 5️⃣ Start the development server

```sh
npm run dev
# or
pnpm run dev
```

By default, the server will run at **`http://localhost:3000`**.

## 🚀 Running in Production

To run the project in **production mode**:

```sh
npm run build
npm start
# or
pnpm run build
pnpm start
```

## 🔍 API Endpoints

### Authentication Routes

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | User login          |

### User Routes

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/api/users`     | Get list of all users |
| GET    | `/api/users/:id` | Get user by ID        |
| PATCH  | `/api/users/:id` | Update user details   |
| DELETE | `/api/users/:id` | Delete user           |

## 🎨 Code Formatting

ESLint and Prettier are configured. Run the following command to format code:

```sh
npm run lint
```

## 📌 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.
