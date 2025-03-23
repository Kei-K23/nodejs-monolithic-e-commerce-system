# Node.js Monolithic E-Commerce System

A monolithic e-commerce backend service built with **Node.js**, **Express**, **MongoDB**, and **Redis**. This service provides APIs for user authentication, user management, product management, inventory management, order handling, coupon and discount, order analytics reports and much more.

## 🚀 Features

- **Authentication & Authorization** (JWT-based)
- **RBAC** (role-based authentication and authorization)
- **Product Management** (CRUD operations)
- **User Management** (CRUD operations)
- **Inventory Management** (CRUD operations)
- **Order Processing**
- **Stripe integration** for order payment checkout
- **Coupon code and discount** (Product discount with coupon code)
- **Email message sending** (Order create, Payment success and Shipping payment)
- **Redis Caching** for improved performance
- **MongoDB Database** for persistent storage
- **API ratelimiting** to improve security and performance
- **Global Error handling middleware** to catch all error
- **Logging and storing log** for better issues tracing
- **Mongodb Aggregation pipeline** for analytics reportings
- **Dockerized** for easy deployment and self-hosting

---

## 🛠️ Tech Stack

- **TypeScript** - Language
- **Node.js** – Backend runtime
- **Express.js** – Web framework for APIs
- **MongoDB** – NoSQL database
- **Redis** – Caching layer
- **Docker & Docker Compose** – Containerization
- **pnpm** – Fast package manager
- **Mongoose** – ODM for MongoDB
- **Nodemailer** – Email transport client
- **Winston & Morgan** – Logging
- **imagekit** – Product image upload
- **fast-csv** – Download analytics report with .csv format

---

## 📦 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Kei-K23/nodejs-monolithic-e-commerce-system.git
cd nodejs-monolithic-e-commerce-system
```

### 2️⃣ Setup Environment Variables

Create a `.env` file and configure it:

```bash
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
MONGODB_URI=<YOUR_MONGODB_URI>
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=<YOUR_JWT_EXPIRES_IN>
IMAGE_UPLOAD_URL_ENDPOINT=<YOUR_IMAGEKIT_IMAGE_UPLOAD_URL_ENDPOINT>
IMAGE_UPLOAD_PRIVATE_KEY=<YOUR_IMAGEKIT_IMAGE_UPLOAD_PRIVATE_KEY>
IMAGE_UPLOAD_PUBLIC_KEY=<YOUR_IMAGEKIT_IMAGE_UPLOAD_PUBLIC_KEY>
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>
NODEMAILER_EMAIL_USER=<YOUR_NODEMAILER_EMAIL_USER>
NODEMAILER_EMAIL_PASS=<YOUR_NODEMAILER_EMAIL_PASS>
```

---

## 🐳 Running with Docker

### **Start the Services**

```sh
docker-compose up -d --build
```

### **Stop the Services**

```sh
docker-compose down
```

---

## 🏗️ Running Locally (Without Docker)

1. Install dependencies

   ```sh
   pnpm install
   ```

2. Start MongoDB & Redis (If not using Docker)

   ```sh
   mongod --port 27017
   redis-server
   ```

3. Start the application
   ```sh
   pnpm start
   ```

---

## 🔥 API Endpoints

| Method | Endpoint                | Description       |
| ------ | ----------------------- | ----------------- |
| `POST` | `/api/v1/auth/login`    | User login        |
| `POST` | `/api/v1/auth/register` | User registration |
| `GET`  | `/api/v1/products`      | Get all products  |
| `POST` | `/api/v1/products`      | Add a new product |

_For more details, refer to the Postman API documentation._
[Nodejs Monolithic E-commerce System.postman_collection.json](/Nodejs%20Monolithic%20E-commerce%20System.postman_collection.json)

---

## 📝 License

This project is **[MIT Licensed](/LICENSE)**.

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a new branch (`feature/new-feature`)
3. **Commit** your changes
4. **Push** to your branch
5. **Open** a Pull Request
