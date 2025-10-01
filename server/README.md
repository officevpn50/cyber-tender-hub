# Cyber50 Proxy Server

A Node.js proxy server with intelligent caching for the Cyber50 tender aggregator.

## Features
- ✅ 5-minute caching to avoid rate limits
- ✅ Graceful fallback to stale cache on errors
- ✅ CORS enabled for frontend access
- ✅ Health check endpoint

## Installation

```bash
cd server
npm install
```

## Running the Server

### Development mode (with auto-reload)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

The server will run on port 3001 by default (change with `PORT` environment variable).

## PM2 Deployment (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start the proxy server
pm2 start proxy-server.js --name cyber50-proxy

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

## Nginx Configuration

Add this to your Nginx config to proxy requests:

```nginx
location /api/ {
    proxy_pass http://localhost:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Testing

```bash
# Health check
curl http://localhost:3001/health

# Fetch tenders
curl -X POST http://localhost:3001/api/tenders
```

## Environment Variables

- `PORT` - Server port (default: 3001)
