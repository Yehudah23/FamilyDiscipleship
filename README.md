# FamilyDiscipleship

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.9.

## Development server

Install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env
```

In `.env`, enter the Cloudinary cloud name, API key, and API secret from the
Cloudinary Console. `ADMIN_PASSWORD=family` is configured for local
development; replace it with a long, unique password before deployment.
Replace `SESSION_SECRET` with a long random value as well. Never commit `.env`
or expose `CLOUDINARY_API_SECRET` in Angular code.

Run the API and Angular app together:

```bash
npm run dev
```

Open `http://localhost:4300/`. The Angular dev server proxies `/api` requests
to the Node.js server on port 3000. Check `http://localhost:3000/api/health`
for missing server configuration.

## Building

```bash
npm run build
```

## Running unit tests

```bash
npm test
```

## Admin authentication and Cloudinary storage

The Node API in `server/index.js` handles password-only admin login, signed
Cloudinary image uploads, and the messages, blogs, and disciplers APIs. Admin
sessions use an `HttpOnly`, `SameSite=Strict` cookie (also `Secure` in
production), and write endpoints require that session.

This project stores content data as JSON raw assets in Cloudinary, in addition
to storing uploaded images. This is a simple small-project setup, not a
general-purpose database: Cloudinary raw assets are publicly deliverable, so
store only content intended to be public. The server initializes the three
JSON assets with the sample content on first read. Subsequent admin changes
are saved back to Cloudinary.

Create a Cloudinary account and copy the cloud name, API key, and API secret
from its Console into the matching `.env` variables. Keep the API secret on
the server. The app uploads message images to `messages`, blog images to
`blogs`, and profile photos to `discipler-avatars`. The Node API signs those
uploads; the browser never receives the API secret.

For deployment, run the Angular app and Node API behind HTTPS on the same
origin (or proxy `/api` to the Node service). Set `NODE_ENV=production`, use a
strong unique `ADMIN_PASSWORD` and `SESSION_SECRET`, and configure Cloudinary
credentials in the hosting provider's secret/environment settings. Do not
deploy the example password `family`.

## Additional Resources

For more information, see the [Angular CLI documentation](https://angular.dev/tools/cli).
