# Spotify Clone

A full-stack music streaming web app with authentication, playlist management, and live song search — built independently, end to end, using vanilla JavaScript on both the frontend and backend (no frontend framework like React/Next.js).

## Why build the full pipeline manually?

Frameworks like Next.js abstract away most of the frontend-backend communication (routing, API structure, auth wiring). This project was built without that abstraction on purpose — to understand and implement, from scratch:

- How a frontend (served on a separate origin) talks to a backend API (CORS, credentials)
- How authentication state is created, passed, and verified across requests (JWT, not session-based)
- How to structure routes, middleware, and models without a framework deciding it for you

## Features

- **Authentication** — signup/login with bcrypt password hashing and JWT-based auth (7-day expiry)
- **Protected routes** — custom middleware verifies the JWT on every protected endpoint (`/me`, `/playlist`, `/getplaylist`)
- **Playlist management** — create playlists, add songs to a playlist, delete songs from a playlist
- **Live song search** — integrates the iTunes Search API to search and preview real songs
- **Audio player** — play/pause, seek bar, skip forward/back — built with the native `Audio` API, no plugin

## Tech Stack

**Frontend:** HTML5, CSS3, vanilla JavaScript, EJS (for server-rendered search results)
**Backend:** Node.js, Express
**Database:** MongoDB with Mongoose
**Auth:** bcryptjs, jsonwebtoken
**External API:** iTunes Search API

## Architecture

```
server.js          → Express app, all routes, JWT middleware
models/
 ├─ user.js         → user schema (email, hashed password)
 ├─ playlist.js     → playlist schema (owner, songs[])
 ├─ song.js         → song schema
 └─ artist.js       → artist schema
views/              → EJS templates (login, signup, search results)
public/             → static frontend (search page styling + player logic)
app.js, index.html  → separate static frontend served on its own origin
```

**How auth flows end to end:**
1. User signs up → password hashed with bcrypt → stored in MongoDB
2. User logs in → credentials verified → JWT signed with a 7-day expiry → sent back to the client
3. Client stores the token and attaches it as a `Bearer` token on every request to a protected route
4. Custom middleware on the backend verifies the token before allowing access to `/me`, `/playlist`, `/getplaylist`

## Running Locally

```bash
npm install
```

Create a `.env` file in the root:
```
JWT_SECRET=your-secret-here
```

Requires a local MongoDB instance on `mongodb://127.0.0.1:27017`.

```bash
node server.js   # backend on http://localhost:8080
```
Serve the static frontend (`index.html`) on `http://127.0.0.1:3000`.

## Future Improvements

- Migrate the manual frontend-backend wiring to a framework (Next.js) to compare tradeoffs directly, having first built it by hand
- Replace `alert()`-based UI feedback with proper toast/modal components
- Add refresh tokens instead of a single long-lived JWT
- Add pagination for search results and playlists
- Move song/artist seeding (`/add` route) into a dedicated, environment-gated seed script
- Delete-song and full playlist-editing flow are still being refined

## About

Built by Harsh Bhundiya as an independent full-stack project, with a deliberate focus on understanding the frontend-backend pipeline (auth, API design, CORS) without relying on a framework to handle it.
