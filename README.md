# My Dream Box

My Dream Box is a full-stack personal wish list where users can create an
account, sign in securely, and save the dreams they want to achieve. Every user
has a private Dream Box that stays synchronized across devices.

**Live application:** [https://havetodo.eu](https://havetodo.eu)

## Features

- Create an account with a username and password
- Sign in with Google Identity Services
- Secure password hashing with bcrypt
- JWT-based authentication
- Add, achieve, and delete dreams
- Store a separate wish list for every user
- Restore the user's Dream Box after a refresh
- Responsive interface built with Tailwind CSS
- REST API with validation, CORS protection, rate limiting, and security headers

## Architecture

```text
React + TypeScript frontend (Hostinger)
                 |
                 | HTTPS / REST API
                 v
Node.js + Express backend (Render)
                 |
                 v
          MongoDB Atlas
```

The frontend and backend are kept in a single repository. The React application
lives in the repository root, while the Express API is located in `server/`.
Internally, dreams are represented as tasks in the REST API and database model.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Google Identity Services

### Backend

- Node.js
- Express
- MongoDB and Mongoose
- JSON Web Tokens
- bcrypt
- Google Auth Library
- Helmet
- Express Rate Limit

### Hosting

- Frontend: Hostinger
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
todo-react-myapp/
├── public/
├── src/
│   ├── Components/
│   │   ├── CredentialsForm.tsx
│   │   ├── Footer.tsx
│   │   ├── GoogleLoginButton.tsx
│   │   ├── TodoForm.tsx
│   │   └── TodoItem.tsx
│   ├── api.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── server/
│   ├── src/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── .env.example
├── render.yaml
└── package.json
```

## Local Development

### Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas database
- A Google OAuth 2.0 Client ID for a web application

### 1. Clone the repository

```bash
git clone https://github.com/kokkilias23/todo-react-myapp.git
cd todo-react-myapp
```

### 2. Configure and start the backend

Install its dependencies:

```bash
cd server
npm install
```

Create `server/.env` using `server/.env.example` as a template:

```env
PORT=3000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/havetodo
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Configure and start the frontend

Open a second terminal in the repository root and install the dependencies:

```bash
npm install
```

Create a root `.env` using `.env.example` as a template:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

Start Vite:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## API Endpoints

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/api/health` | No | Check API availability |
| `POST` | `/api/auth/register` | No | Create a username/password account |
| `POST` | `/api/auth/login` | No | Sign in with username/password |
| `POST` | `/api/auth/google` | No | Verify a Google credential and sign in |
| `GET` | `/api/auth/me` | Bearer token | Return the current user |
| `GET` | `/api/tasks` | Bearer token | Return the current user's tasks |
| `POST` | `/api/tasks` | Bearer token | Create a task |
| `PATCH` | `/api/tasks/:id` | Bearer token | Update a task |
| `DELETE` | `/api/tasks/:id` | Bearer token | Delete a task |

## Production Build

Configure the production values in the root `.env`, then run:

```bash
npm run build
```

Vite creates the deployable frontend inside `dist/`.

The backend can be deployed as a Render Web Service with:

```text
Root directory: server
Build command:  npm install
Start command:  npm start
```

Set these environment variables on Render:

```text
MONGODB_URI
GOOGLE_CLIENT_ID
JWT_SECRET
FRONTEND_URL
```

## Security

- Passwords are hashed with bcrypt and are never stored as plain text.
- Google ID tokens are verified by the backend with Google's official library.
- Protected routes require a signed JWT bearer token.
- Every task query is scoped to the authenticated user.
- Database credentials and signing secrets are stored in environment variables.
- `.env` files are excluded from Git.
- The API uses Helmet, request-size limits, CORS restrictions, and authentication
  rate limiting.

## Useful Commands

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
cd server
npm run dev
npm start
```

## Author

Created by **Ilias Kokkalidis** as a full-stack project for Coding Factory 9.
