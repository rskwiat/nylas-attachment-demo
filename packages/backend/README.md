# Backend API

Express.js backend server with TypeScript for the Nylas Attachment project.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Start development server:
   ```bash
   yarn dev
   ```

4. Or build and run production:
   ```bash
   yarn build
   yarn start
   ```

## Available Scripts

- `yarn dev` - Start development server with ts-node
- `yarn watch` - Start development server with watch mode
- `yarn build` - Build TypeScript to JavaScript
- `yarn start` - Start production server
- `yarn clean` - Remove build directory

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - Main API endpoint

## Development

The server runs on port 3001 by default. You can change this by setting the `PORT` environment variable.

### Project Structure

```
src/
├── index.ts          # Main application file
└── ...               # Add your routes, models, etc.
```
