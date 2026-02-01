# Deployment Guide

## Employee Management System - Production Deployment

This guide covers deploying the EMS to various production environments.

---

## 🚀 Quick Deployment

### Option 1: Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to complete deployment.

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

### Option 3: GitHub Pages

```bash
# Add to package.json
{
  "homepage": "https://yourusername.github.io/employee-management-system"
}

# Install gh-pages
npm install --save-dev gh-pages

# Add deploy scripts to package.json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

---

## 🛠️ Frontend Deployment (Current State)

### Prerequisites
- Node.js 18+ installed
- npm or pnpm package manager
- Git repository

### Build Process

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Environment Configuration

Create `.env.production` file:

```env
# API Configuration (for future backend)
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=Employee Management System
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### Build Optimization

**vite.config.ts** (if needed):

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          ui: ['lucide-react', 'recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
  },
});
```

---

## 🗄️ Backend Deployment (Future Implementation)

### Option 1: AWS EC2

**1. Launch EC2 Instance**
```bash
# Ubuntu 22.04 LTS
# t2.medium or larger

# Connect to instance
ssh -i "your-key.pem" ubuntu@your-instance-ip
```

**2. Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

**3. Deploy Application**
```bash
# Clone repository
git clone https://github.com/yourusername/ems-backend.git
cd ems-backend

# Install dependencies
npm install

# Create .env file
nano .env

# Start with PM2
pm2 start npm --name "ems-api" -- start
pm2 startup
pm2 save
```

**4. Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/ems
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ems /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Heroku

**heroku.yml**:
```yaml
build:
  docker:
    web: Dockerfile
run:
  web: npm start
```

**Deployment**:
```bash
# Login to Heroku
heroku login

# Create app
heroku create ems-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri

# Deploy
git push heroku main

# Scale
heroku ps:scale web=1
```

### Option 3: Docker Container

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/ems
    depends_on:
      - mongodb
    restart: always

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./dist:/usr/share/nginx/html
    depends_on:
      - api
    restart: always

volumes:
  mongodb_data:
```

---

## 💾 Database Deployment

### MongoDB Atlas (Recommended)

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: 
   - Choose region
   - Select M0 (free tier) or appropriate tier
3. **Create Database User**
4. **Whitelist IP**: Add your server IP
5. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ems?retryWrites=true&w=majority
   ```

### Self-Hosted MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
> use admin
> db.createUser({
    user: "admin",
    pwd: "strongpassword",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  })
> exit

# Enable authentication
sudo nano /etc/mongod.conf
# Add: security.authorization: enabled

# Restart
sudo systemctl restart mongod
```

---

## 🔐 SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Custom SSL Certificate

```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate CSR
openssl req -new -key private.key -out certificate.csr

# Install certificate in Nginx
sudo nano /etc/nginx/sites-available/ems
```

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... rest of configuration
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Generate startup script
pm2 startup

# Save process list
pm2 save
```

### Application Logging

**Install Winston** (Backend):
```bash
npm install winston
```

**logger.ts**:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

### Error Tracking

**Sentry Integration**:
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "your-sentry-dsn",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**.github/workflows/deploy.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🧪 Pre-Deployment Checklist

### Frontend
- [ ] Environment variables configured
- [ ] Build completed successfully
- [ ] No console errors or warnings
- [ ] All routes tested
- [ ] Responsive design verified
- [ ] Cross-browser testing completed
- [ ] Performance audit passed (Lighthouse score > 90)
- [ ] SEO metadata added
- [ ] Error boundaries implemented
- [ ] Analytics integrated

### Backend (Future)
- [ ] Database migrations completed
- [ ] Environment variables set
- [ ] API rate limiting configured
- [ ] CORS policies set
- [ ] Security headers configured
- [ ] Logging configured
- [ ] Error tracking set up
- [ ] Health check endpoint working
- [ ] Database backup configured
- [ ] SSL certificates installed

### Security
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Rate limiting enabled
- [ ] Secrets stored securely

---

## 📈 Performance Optimization

### CDN Configuration

**Cloudflare**:
```javascript
// cloudflare-worker.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const cache = caches.default
  let response = await cache.match(request)

  if (!response) {
    response = await fetch(request)
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'public, max-age=3600')
    
    response = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
    
    event.waitUntil(cache.put(request, response.clone()))
  }

  return response
}
```

### Caching Strategy

**Nginx Caching**:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_lock on;
}
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
```

**2. Environment Variables Not Loading**
```bash
# Check .env file exists
ls -la | grep .env

# Verify variable names start with VITE_
cat .env.production
```

**3. Port Already in Use**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

**4. Memory Issues**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 📞 Support & Maintenance

### Backup Strategy

**Daily Backups**:
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="ems"

# MongoDB backup
mongodump --uri="mongodb://localhost:27017/$DB_NAME" --out="$BACKUP_DIR/mongo_$DATE"

# Compress
tar -czf "$BACKUP_DIR/mongo_$DATE.tar.gz" "$BACKUP_DIR/mongo_$DATE"
rm -rf "$BACKUP_DIR/mongo_$DATE"

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/mongo_$DATE.tar.gz" s3://your-bucket/backups/

# Clean old backups (keep last 30 days)
find "$BACKUP_DIR" -name "mongo_*.tar.gz" -mtime +30 -delete
```

**Cron Job**:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

---

**Deployment Date**: January 29, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
