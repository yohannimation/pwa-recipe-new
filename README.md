# 🍲 Recipe PWA

Welcome to the project of the recipe management application. This is structured as a mono-repo to facilitate the joint development of the frontend and backend.

## Frontend

> coming soon

## Backend

### 🚀 Project Overview

The backend is a robust REST API built with **NestJS** and **Fastify**, enabling complete management of cooking recipes, ingredients, categories, and users.

#### Key Features:
- **Authentication & Authorization**: JWT-based login/register system with role management (`ADMIN`, `CHEF`, lambda `USER`).
- **Recipe Management**: Full CRUD (Create, Read, Update, Delete) functionality for recipes.
- **Media Management**: Image upload and storage for recipes.
- **External Integration**: Integration with the **Spoonacular API** for intelligent ingredient searching.
- **Organization**: Recipe classification by categories and detailed preparation steps.
- **API Documentation**: Integrated Swagger for testing and exploring endpoints.

### 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **HTTP Server**: [Fastify](https://www.fastify.io/) (for high performance)
- **Database**: [TypeORM](https://typeorm.io/) with [PostgreSQL](https://www.postgresql.org/)
- **Documentation**: [Swagger](https://swagger.io/)
- **External APIs**: Spoonacular API
- **Validation**: Class-validator & Class-transformer

### 📖 API & Documentation

The API is accessible under the `/api` prefix.
Once the server is running, you can access the interactive Swagger documentation:
👉 `http://localhost:3000/api/docs`

#### Main Endpoints:
- `POST /api/auth/register`: Account creation
- `POST /api/auth/login`: Authentication
- `GET /api/recipes`: List of recipes (filters by name/category)
- `POST /api/recipes`: Create a recipe (Admin/Chef)
- `POST /api/recipes/:id/image`: Upload image for a recipe

## Installation

### 🛠️ Configuration

The project uses environment variables for configuration. Create a `.env` file in the root directory based on the `.env.dist` file.

Variables details :

**Database:**
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: `5432`)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name

**Authentication:**
- `JWT_SECRET`: Secret key for signing JWT tokens
- `JWT_EXPIRES_IN`: Token expiration time (e.g., `3600s` or `1d`)

**External APIs:**
- `SPOONACULAR_API_KEY`: Your Spoonacular API key for ingredient search

**Management Tools (Optional):**
- `PGADMIN_EMAIL`: Email for pgAdmin login
- `PGADMIN_PASSWORD`: Password for pgAdmin login

### 🚀 Getting Started

The easiest way to start the project with all its dependencies is using Docker Compose:

```bash
# Start all services in the background
docker compose up -d
```

The backend will be available at `http://localhost:3000` and pgAdmin at `http://localhost:5050`.

Once started, you can access the API documentation at `http://localhost:3000/api/docs`.
