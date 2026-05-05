# LetBy – Telegram Mini App Marketplace

## Quick Start

```bash
npm install
BOT_TOKEN=your_token APP_URL=https://your-url.com node server.js
```

## Environment Variables

| Variable    | Required | Description                                      |
|-------------|----------|--------------------------------------------------|
| `BOT_TOKEN` | ✅ Yes    | Your Telegram bot token from @BotFather          |
| `APP_URL`   | ✅ Yes    | Your public HTTPS URL (e.g. Render/Railway URL)  |
| `PORT`      | Optional | Port to listen on (default: 3000)                |

## Deploy to Render (Free)

1. Push this folder to a GitHub repo
2. Go to https://render.com → New → Web Service
3. Connect your repo
4. Set env vars:
   - `BOT_TOKEN` = your token
   - `APP_URL` = your Render URL (e.g. `https://letby.onrender.com`)
5. Start command: `node server.js`
6. Deploy ✅

## Deploy to Railway

1. `railway login && railway init`
2. `railway up`
3. Set env vars in Railway dashboard

## Deploy to Replit

1. Upload files to a new Replit Node.js project
2. Add Secrets: `BOT_TOKEN` and `APP_URL`
3. Click Run

## API Endpoints

| Method | Path        | Description        |
|--------|-------------|--------------------|
| GET    | `/`         | Mini App frontend  |
| GET    | `/listings` | Fetch all listings |
| POST   | `/listings` | Add new listing    |

### POST /listings body
```json
{
  "title": "iPhone 14 Pro",
  "price": "$850",
  "description": "Mint condition with box",
  "seller_username": "john_doe"
}
```

## Bot Commands
- `/start` – Opens the mini app with a button
- `/help` – Shows help message
