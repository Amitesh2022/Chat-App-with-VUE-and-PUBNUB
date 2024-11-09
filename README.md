
# Project Name

A brief description of what your project does and its purpose.

## Table of Contents
- [Project Name](#project-name)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- List of main features of the project
- Include features like authentication, real-time chat, etc.

## Tech Stack
- **Frontend:** Vue.js, PubNub
- **Backend:** Node.js, Express, MongoDB
- **Authentication:** JWT
- **Real-time Messaging:** PubNub API

## Getting Started
These instructions will help you set up the project on your local machine.

### Prerequisites
- Node.js (version >= 14)
- MongoDB
- A PubNub account for API keys

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   ```
2. **Navigate to the project folder:**
   ```bash
   cd project-folder
   ```

3. **Install dependencies:**
   - For the backend:
     ```bash
     cd backend
     npm install
     ```
   - For the frontend:
     ```bash
     cd ../frontend
     npm install
     ```

4. **Set up environment variables:**
   - Create a `.env` file in the `backend` directory with the following:
     ```dotenv
     MONGO_URI=mongodb://localhost:27017/chatapp
     JWT_SECRET=<your-jwt-secret>
     PUBNUB_PUBLISH_KEY=<your-pubnub-publish-key>
     PUBNUB_SUBSCRIBE_KEY=<your-pubnub-subscribe-key>
     PUBNUB_SECRET_KEY=<your-pubnub-secret-key>
     ```

### Usage
1. **Start MongoDB:**
   ```bash
   mongod
   ```

2. **Run the backend server:**
   ```bash
   cd backend
   npm start
   ```
   This will start the backend server at `http://localhost:5001`.

3. **Run the frontend development server:**
   ```bash
   cd frontend
   npm run serve
   ```
   This will start the frontend at `http://localhost:8080`.

## Project Structure
- `frontend/` - Contains Vue.js front-end files
- `backend/` - Contains Express server code and API routes
  - `controllers/` - Handles business logic
  - `models/` - Defines MongoDB schemas
  - `routes/` - Defines API endpoints

## Contributing
1. **Fork the project**
2. **Create a new branch** (`git checkout -b feature/your-feature`)
3. **Commit your changes** (`git commit -m 'Add some feature'`)
4. **Push to the branch** (`git push origin feature/your-feature`)
5. **Create a pull request**

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
