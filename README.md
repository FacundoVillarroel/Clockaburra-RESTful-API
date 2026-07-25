# Clockaburra REST API

<p align="center">
  <img src=".src/assets/swagger-preview.png" width="900" alt="Clockaburra Swagger"/>
</p>

Backend API for the Clockaburra employee management platform.

Clockaburra is a Full Stack SaaS project created to simulate a real-world employee management system, with a strong focus on software architecture, maintainability and scalability. This repository contains the REST API consumed by both the web and mobile applications.

Built with **Node.js**, **Express**, **TypeScript**, **Firebase Authentication**, **JWT** and fully documented using **Swagger**.

## Features

- 👤 **User Management**  
  Create and manage users with role-based access.

- 🏢 **Department Management**  
  Organize employees into departments for better workforce administration.

- 🗓️ **Shift Management**  
  Create and assign work shifts to employees.

- ⏱️ **Attendance Tracking**  
  Register employee check-ins and check-outs through dedicated clock endpoints.

- 📄 **Timesheet Records**  
  Store and retrieve attendance history for worked shifts.

- 🔐 **Authentication & Authorization**  
  Secure authentication using Passport, Firebase Authentication and JWT.

- 🖼️ **Image Uploads**  
  Upload and manage profile images through dedicated endpoints.

- 📚 **Interactive API Documentation**  
  Explore and test every endpoint directly from Swagger UI.

## Architecture

### Layered Architecture
The backend follows a layered architecture to keep responsibilities separated and make the project easier to maintain as it grows.

- **Routes** handle incoming HTTP requests.
- **Controllers** process requests and coordinate the application flow.
- **Services** contain the business logic.
- **DAOs** abstract data access from the rest of the application.
- **Models** define the application's data structures.
- **Middlewares** centralize authentication, authorization and request validation.
- **Utils & Config** provide reusable utilities and application configuration.

This separation allows each layer to evolve independently while keeping the codebase organized and maintainable.

### Design Decisions

This project was built with the idea of simulating a real-world backend rather than a simple CRUD application.

Some of the design decisions include:

- Separation of business logic from routing.
- Independent data access layer using DAOs.
- Stateless authentication using JWT.
- Firebase Authentication integration.
- Interactive API documentation with Swagger.
- Shared REST API designed to serve both web and mobile applications.

### Project Structure

```text
Clockaburra-RESTful-API
│
├── src
│   ├── config/          # Application configuration
│   ├── controllers/     # HTTP request handlers
│   ├── dao/             # Data access layer
│   │   ├── factory/
│   │   ├── firebase/
│   │   └── ...
│   ├── middlewares/     # Authentication and request processing
│   ├── models/          # Domain models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── utils/           # Shared utilities
│   ├── docs/            # Swagger configuration
│   └── app.ts
│
├── package.json
├── tsconfig.json
└── README.md
```

### Folder Overview

| Folder | Responsibility |
|---------|----------------|
| **routes** | Defines all API endpoints and maps requests to controllers. |
| **controllers** | Validates requests and coordinates the application flow. |
| **services** | Contains the application's business logic. |
| **dao** | Provides an abstraction layer for data access. |
| **middlewares** | Handles authentication, authorization and request validation. |
| **models** | Represents the application's domain entities. |
| **config** | Centralizes application configuration. |
| **utils** | Shared helper functions used across the project. |
| **docs** | Swagger configuration and API documentation. |


### Data Access Layer

The project uses a dedicated DAO layer to isolate data access from the business logic.

This approach keeps services independent from the underlying persistence implementation, making the codebase easier to maintain and extend.

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Authentication** | Firebase Authentication · Passport.js · JWT |
| **Database** | Firebase Firestore |
| **API Documentation** | Swagger |
| **File Uploads** | Multer |
| **Email Service** | Mailjet |
| **Utilities** | Luxon |

---

## Getting Started

### Requirements

Before running the project, make sure you have the following installed:

- Node.js 20+
- npm
- A Firebase project configured
- A Mailjet account (required for email functionality)

---

### Installation

Clone the repository and install the dependencies.

```bash
git clone https://github.com/FacundoVillarroel/Clockaburra-RESTful-API.git

cd Clockaburra-RESTful-API

npm install
```

---

### Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

Example:

```env
PORT=8080

JWT_SECRET=your_jwt_secret

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key

MAILJET_API_KEY=your_mailjet_api_key
MAILJET_SECRET_KEY=your_mailjet_secret_key
```

> **Note:** The complete list of environment variables depends on your Firebase and Mailjet configuration.

---

### Running the API

Start the development server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:8080/
```

---

## API Documentation

Clockaburra includes interactive API documentation powered by **Swagger**.

Once the server is running, you can explore and test every available endpoint directly from your browser:

```text
http://localhost:8080/api-docs
```

Swagger provides request and response schemas, endpoint descriptions and an interactive interface for testing the API.

---

## Why I Built This Project

Clockaburra was created as a personal project with the goal of simulating how a real-world SaaS application could be designed and structured.

Instead of focusing only on implementing features, I wanted to understand the architectural decisions behind building software that could eventually support multiple companies, multiple users and different client applications through a shared REST API.

Throughout the project I explored concepts such as layered architecture, authentication, service abstraction, API documentation and scalable backend design, always prioritizing maintainability and clear separation of responsibilities.

Although Clockaburra was developed as a learning project, every architectural decision was made with the mindset of building a product that could realistically evolve into a SaaS platform.

Clockaburra represents my approach to software development: understanding the problem first, designing a maintainable architecture, and building software with long-term scalability in mind.

---

## Author

**Facundo Villarroel**

Full Stack Software Development with a strong interest in software architecture and scalable backend systems.
- GitHub: https://github.com/FacundoVillarroel
- LinkedIn: https://www.linkedin.com/in/villarroelfacundo/

---

## License

This project is licensed under the MIT License.
