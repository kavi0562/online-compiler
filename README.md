# Online Compiler

A web-based online code editor and compiler — React frontend with a Node.js/Express backend that integrates with Firebase and external services.

## Contents
- client/ — React frontend (Create React App)
- server/ — Express backend (Node.js)

## Prerequisites
- Node.js (v16+ recommended)
- npm (v8+)
- MongoDB URI (MongoDB Atlas) for DATABASE
- Firebase service account JSON (placed at server/serviceAccountKey.json)
- Environment variables (see below)

## Environment variables
Create a server/.env file (do NOT commit secrets). Required keys used by the project:
- MONGO_URI - MongoDB connection string
- JWT_SECRET - JWT signing secret
- GROQ_API_KEY - Groq API key (if used)
- GITHUB_TOKEN - GitHub personal access token (if used)
- PORT - (optional) Server port (default 5051)

Example (server/.env):
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
GROQ_API_KEY=your_groq_api_key_here
GITHUB_TOKEN=your_github_token_here
PORT=5051

Note: The repository currently contains a serviceAccountKey.json file under server/ used to initialize Firebase Admin. Verify you have the correct credentials and rotate or remove any committed secrets before publishing.

## Installation (local)
1. Clone the repo:
   git clone https://github.com/kavi0562/online-compiler.git
   cd online-compiler

2. Install root (optional):
   npm install

3. Server setup:
   cd server
   npm install
   # create server/.env as described above

4. Client setup:
   cd ../client
   npm install

## Running locally (development)
- Start the server (from server/):
  npm run dev
  # or: npm start
  # Server listens on PORT or defaults to 5051 (127.0.0.1)

- Start the client (from client/):
  npm start
  # React development server runs (default port 3000)

The frontend expects the backend at http://localhost:5051 by default (check any hard-coded API URLs in the client).

## Building / "Compiling" the program
- Client (React build):
  cd client
  npm run build
  This produces an optimized static bundle in client/build/ that can be served by any static web server or integrated into the backend.

- Server:
  The server is a Node.js application (CommonJS). It does not require compilation — run it with Node. If you want to containerize or transpile, add a build step or Dockerfile as required.

If you want a production setup that serves the client from the server, you can copy client/build/ into server/public (or configure Express to serve client/build) and run the server:
1. In client/: npm run build
2. Copy or move client/build to server/public (or adjust Express static path)
3. In server/: npm start

## Docker
There is a server/docker/ directory; if you plan to containerize, add or update Dockerfile and docker-compose.yml to suit your environment.

## API routes (high level)
The server mounts several route groups under /api. Example endpoints visible in the code:
- GET /api/status — health check
- /api/compiler — language list and compile/run endpoints (check server/routes/compiler.js)
- /api/auth, /api/users, /api/github, /api/payment, etc.

## Security & Secrets
- Remove any committed secrets (service account JSON, .env values) from the repo before publishing.
- Use GitHub Secrets / environment variables in CI/CD and hosting platforms.

## Notes & Troubleshooting
- If MongoDB connection fails, ensure MONGO_URI is valid and network access (IP whitelist) is configured in Atlas.
- If Firebase initialization fails, verify server/serviceAccountKey.json credentials and Firebase project permissions.
- If frontend cannot reach backend, ensure CORS and the base URLs are configured consistently.

## Contributing
Open issues or PRs with clear descriptions. Remove sensitive data before sharing.
