# Deployment Guide

This guide covers how to deploy the MERN Online Compiler application.

## Prerequisites

- **Node.js**: v16+
- **MongoDB**: Atlas or local instance
- **Docker** (optional but recommended for Backend isolation)

## 1. Backend Deployment

You can deploy the backend to platforms like Render, Railway, or a VPS (DigitalOcean/AWS).

### Environment Variables
Set the following environment variables on your server:

```env
PORT=5051
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/compiler-db
JWT_SECRET=your_super_safe_secret_key
```

### Docker (Recommended)
The backend includes a `Dockerfile`. To build and run:

```bash
# Build image
docker build -t mern-compiler-server .

# Run container
docker run -p 5051:5051 --env-file .env mern-compiler-server
```

### Manual Deployment
```bash
npm install
npm start
```

## 2. Frontend Deployment

The frontend is a React app that can be deployed to Vercel, Netlify, or any static site host.

### Build Steps

1.  Update the API URL:
    - In `client/src/components/UserDashboard.js`, `HistoryPage.js`, etc., ensure the Axios calls point to your *production* backend URL (e.g., `https://api.yourdomain.com`) instead of `localhost:5051`.
    - Ideally, use an environment variable like `REACT_APP_API_URL`.

2.  Build the project:
    ```bash
    npm install
    npm run build
    ```

3.  Deploy the `build` folder.

## 3. Piston API (Code Execution)

The backend relies on the generic Piston API (`https://emkc.org/api/v2/piston/execute`).
- **Rate Limits**: The public API has rate limits.
- **Production**: For a production app with many users, you should self-host Piston:
  - Piston GitHub: https://github.com/engineer-man/piston
  - Deploy Piston on a separate VPS or alongside your backend using Docker Compose.

## 4. Admin Setup

To create the initial admin user:
1.  Register a new user via the Frontend.
2.  Access your MongoDB database directly.
3.  Find the user document and change `"role": "user"` to `"role": "admin"`.
4.  Login with that account to access the Admin Dashboard.
