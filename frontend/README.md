# GenInfotech frontend

React frontend built with Create React App and CRACO.

## Run locally

Make sure MongoDB and the backend API are running first. Configure
`frontend/.env` with the backend URL:

```env
REACT_APP_BACKEND_URL=http://127.0.0.1:8000
```

Install dependencies and start the development server:

```sh
corepack yarn install
corepack yarn start
```

Open [http://localhost:3000](http://localhost:3000). Restart the development
server after changing environment variables.

## Available commands

```sh
corepack yarn start  # Start the development server
corepack yarn test   # Run frontend tests
corepack yarn build  # Create a production build in build/
```

## Project structure

- `src/pages/` — public website pages
- `src/components/` — shared and layout components
- `src/admin/` — admin screens and editors
- `src/context/` — language and site-content state
- `public/` — static images and other public assets
