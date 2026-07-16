# 📝 HaveToDo

A full-stack Todo application with Google login and per-user cloud storage.

## ✨ Features

- ✅ Add new tasks
- ✅ Mark tasks as done
- ✅ Press Enter to add a task
- ✅ Delete tasks
- ✅ Sign in with Google
- ✅ Save each user's progress in MongoDB
- ✅ Clean and responsive UI

## 🧱 Components

| Component | Description |
|-----------|-------------|
| `App.tsx` | Authentication and task state |
| `TodoForm.tsx` | Input form for adding new tasks |
| `TodoItem.tsx` | Displays each individual task |
| `GoogleLoginButton.tsx` | Official Google Identity Services button |
| `server/` | Express API, authentication and MongoDB models |
| `Footer.tsx` | Copyright footer |

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js and Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Google Identity Services](https://developers.google.com/identity/gsi/web)

## 🚀 Getting Started

### Frontend

1. Copy `.env.example` to `.env` and set the Google client ID.
2. Start Vite:

   ```bash
   npm install
   npm run dev
   ```

### Backend

1. Copy `server/.env.example` to `server/.env`.
2. Add the MongoDB URI, the same Google client ID, and a long random JWT secret.
3. Start the API:

   ```bash
   cd server
   npm install
   npm run dev
   ```

The local frontend runs at `http://localhost:5173` and calls the API at
`http://localhost:3000/api`.

## Production

- Deploy the `server` directory as a Render Web Service. A `render.yaml` Blueprint
  is included.
- Set `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, and `FRONTEND_URL` in Render.
- Build the frontend with production values:

  ```bash
  VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api \
  VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID npm run build
  ```

- Upload the contents of `dist` to Hostinger's `public_html` directory.

Never commit `.env` files, the MongoDB connection string, or the JWT secret.

## 👨‍💻 Author

Created by **Ilias Kokkalidis** for Coding Factory
