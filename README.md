# Gen Website

A website for GenInfotech, built as a React frontend, Python API, and PostgreSQL
database.

## Software and technologies

- **Frontend:** React 19, Create React App, and CRACO, with React Router for
  navigation.
- **Styling:** Tailwind CSS and project CSS.
- **Frontend libraries:** Axios for API requests, Lucide React for icons, and
  Clerk React for the optional admin sign-in flow.
- **Backend:** Python 3, FastAPI, and Uvicorn.
- **Database:** PostgreSQL, accessed asynchronously by the backend with
  `asyncpg`.
- **Validation:** Pydantic models for API data.
- **Package managers:** Yarn for frontend dependencies; `pip` and `venv` for
  Python dependencies.

## Database

The local development setup uses PostgreSQL on port `5432`, with database name
`gen_website`. The backend creates its content and enquiry tables on startup.
Create the database once with `createdb gen_website` if it does not already
exist.

On macOS with Homebrew, start and stop PostgreSQL with:

```sh
brew services start postgresql@14
brew services stop postgresql@14
```

The backend reads `DATABASE_URL` and `CORS_ORIGINS` from
`backend/.env`. The frontend reads `REACT_APP_BACKEND_URL` from
`frontend/.env`. These local environment files should not be committed.

## Migrating from MongoDB

The local MongoDB data was copied to PostgreSQL. The migration preserves the
site-content document and enquiry IDs. The source MongoDB database remains
untouched as a backup and is no longer needed to run the application. Start
MongoDB only if you need to repeat the migration. Set `MONGO_SOURCE_URL` and
`MONGO_DB_NAME` in `backend/.env`, ensure the PostgreSQL database exists, then
run:

```sh
cd /Users/mohan/Desktop/gen-website/backend
python3 migrate_mongodb_to_postgres.py
```

Existing PostgreSQL records are not overwritten; duplicate enquiry IDs are
skipped.

## Test deployment on Render (free tier)

The root `render.yaml` defines a Render Blueprint with:

- A free static site for the React frontend.
- A free Python web service for the FastAPI backend.
- A free PostgreSQL database named `gen_website`.

To deploy, push the project to GitHub, sign in to Render, choose **New →
Blueprint**, connect `suhasini2000/gen-website`, and deploy the Blueprint from
the `main` branch. Render will build the frontend and backend, create the
database, and connect the services. The default test URLs are:

- Website: `https://geninfotech-site.onrender.com`
- API health endpoint: `https://geninfotech-api.onrender.com/api/`
- API documentation: `https://geninfotech-api.onrender.com/docs`

The new database starts with the default site content, including the course
list and current social links. It does not copy local enquiry records. Free web
services can sleep when idle and take time to wake on the next visit. Render's
free PostgreSQL databases are temporary and can expire; use this setup only for
testing, and export any data you need to keep before the expiration date shown
in the Render dashboard. Upgrade the database before using the site for
production enquiries.

The admin area stays unavailable until Clerk is configured. To enable it, add
`CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and `ADMIN_EMAIL` to the backend
service's Render environment, then redeploy.

## Start the application on macOS

Start each part in its own Terminal window or VS Code terminal.

### 1. Start PostgreSQL

```sh
brew services start postgresql@14
```

### 2. Start the backend API

```sh
cd /Users/mohan/Desktop/gen-website/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn server:app --reload --host 127.0.0.1 --port 8000
```

The API is at `http://127.0.0.1:8000`. Interactive API documentation is at
`http://127.0.0.1:8000/docs`.

### 3. Start the frontend

```sh
cd /Users/mohan/Desktop/gen-website/frontend
corepack yarn install
corepack yarn start
```

Open `http://localhost:3000`. To stop the frontend or backend, press `Ctrl+C`
in its terminal. PostgreSQL runs as a background service; stop it with the
command above when it is no longer needed.

## Environment files

The local development files contain:

`backend/.env`

```env
DATABASE_URL=postgresql://mohan@127.0.0.1:5432/gen_website
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Only needed when rerunning the one-time MongoDB import:
MONGO_SOURCE_URL=mongodb://127.0.0.1:27017
MONGO_DB_NAME=gen_website
```

`frontend/.env`

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

The frontend API client appends `/api` to `REACT_APP_BACKEND_URL`. Restart the
frontend after changing its environment file. If you recreate these files,
keep the variable names as shown.

Admin authentication additionally needs Clerk credentials and an allowed
administrator email configured in the backend environment. Do not put secret
keys in frontend environment variables or commit them.

## Useful commands

Build the frontend for production:

```sh
cd frontend
corepack yarn build
```

Run the browser smoke test (requires Playwright and its Chromium browser, plus
the frontend running):

```sh
cd /Users/mohan/Desktop/gen-website
python3 test_reports/browser/automation_output/20261107_150642_e8d49/test_script.py
```

Run backend tests:

```sh
cd backend
python -m pytest
```
