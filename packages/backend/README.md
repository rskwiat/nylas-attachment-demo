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

` GET /oauth/exchange` - Init Auth
- `GET /nylas/auth` - Get Authentication
- `POST /nylas/send-email` - Send emails using nylas api
- `GET /nylas/sent-emails` - Get all emails sent from your gmail account
