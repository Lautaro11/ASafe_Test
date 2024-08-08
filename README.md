# ASafe_Test

**Description**
------------

A technical test project demonstrating a monorepo setup with separate packages for API, services, and utilities, using Fastify, Prisma, and TypeScript, along with authentication and authorization features.

**Getting Started**
---------------

### Installation

To install the project locally, follow these steps:

1. Create a `.env` file by copying the `.env.example` file and filling in the required values.
2. Run `yarn install` in the root directory to install the project dependencies.
3. Run `yarn build` to build the project.

### Prerequisites

* Use Yarn instead of NPM to manage dependencies.
* Ensure you have a PostgreSQL database set up and configured.

### Running the Application

To start the application, run `yarn bstart` (this command builds and starts the app) or `yarn start` if you've already run `yarn build` previously.

**Project Structure**
-----------------

The project is organized as a monorepo with separate packages for API, services, and utilities. The structure is as follows:

* `packages/`: contains separate packages for API, services, and utilities
	+ `api/`: API logic, including routes, controllers, and middleware
	+ `services/`: business logic, including services for posts and users
	+ `models/`: data models, including posts and users
	+ `schemas/`: schema definitions using Zod
	+ `utils/`: utility functions, including file upload/download to Backblaze B2 (simulating AWS S3)
* `.dist/`: contains transpiled code
* `.env`: environment variables
* `start.js`: script to start the application
* `tsconfig.json`: TypeScript configuration
* `.gitignore`: files to ignore for Git
* `package.json`: monorepo configuration
* `lerna.json`: Lerna configuration

**Configuration**
-------------

The project uses environment variables to configure the application. You need to create a `.env` file with the following variables:

* `B2_KEY_ID`: required for Backblaze B2 storage
* `B2_APPLICATION_KEY`: required for Backblaze B2 storage
* `B2_BUCKET_NAME`: required for Backblaze B2 storage
* `B2_ENDPOINT`: required for Backblaze B2 storage
* `DATABASE_URL`: required for PostgreSQL database connection
* `HOST`: optional, default host for the application
* `SERVER_URL`: optional, default server URL for the application

**Features**
--------

The project includes the following features:

* Authentication and authorization using JWT
* User management (CRUD operations)
* File upload and download to S3 using AWS SDK
* Real-time notifications
* API documentation using Fastify Swagger
* Monorepo setup with separate packages for API, services, and utilities

**Testing**
-------

To run tests, simply execute `yarn test`. This will run Jest tests that cover all aspects of the application, simulating user interactions and testing routes.

**Usage**
-----

To use the app, access the following URLs:

* Main API: https://asafe-test.onrender.com/
* WebSocket Notifications: https://asafe-test.onrender.com/notifications

In the WebSocket Notifications section, you can see some live interactions with the app.
