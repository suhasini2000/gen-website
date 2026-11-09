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

## Free static deployment on Render

The root `render.yaml` deploys a single free Render Static Site. Courses,
social links, and other site content are bundled in
`frontend/src/data/site-content.json`; image files belong in `frontend/public`.
The website does not need a hosted API or database to display this content.

To deploy, sign in to Render, choose **New → Blueprint**, connect
`suhasini2000/gen-website`, select `main`, and apply the Blueprint. The site
will build and Render will show its public URL when deployment finishes.
Render Static Sites are free and do not spin down when idle.

To update courses or social links, edit `frontend/src/data/site-content.json`
and push the change to `main`; Render automatically rebuilds the site. Add
photos to `frontend/public` and reference them with paths such as `/classroom.jpg`.
The enquiry form opens WhatsApp with the student's details; enquiries are not
stored by this static site. The admin editor is unavailable in this setup.

If you previously deployed the Blueprint that included the API and database,
remove the old `geninfotech-api` service and `geninfotech-db` database from
Render after confirming the static site deployment works.

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

The optional local backend's admin authentication requires Clerk credentials
and an allowed administrator email in its environment. Do not put secret keys
in frontend environment variables or commit them. The free static deployment
does not include the backend or admin editor.

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
