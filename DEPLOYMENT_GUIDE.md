# HealthTrack Deployment Guide

This guide covers deploying the HealthTrack application to production environments.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Production Build](#local-production-build)
3. [Heroku Deployment](#heroku-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Digital Ocean Deployment](#digital-ocean-deployment)
6. [Database Management](#database-management)
7. [Security Checklist](#security-checklist)
8. [Monitoring & Logging](#monitoring--logging)

---

## Prerequisites

### Required Tools
- Node.js 16+ (check with `node --version`)
- npm or yarn
- Git
- MongoDB Atlas account (for cloud database)
- Hosting platform account (Heroku, AWS, Digital Ocean, etc.)

### Environment Variables Required
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthtrack
JWT_SECRET=your-secret-key-min-32-chars
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
```

---

## Local Production Build

### 1. Backend Production Build

**Step 1: Create optimized backend**
```bash
cd backend
npm install --production
# OR for development (includes dev dependencies)
npm install
```

**Step 2: Configure environment**
```bash
cp .env.example .env
# Edit .env with production values
nano .env
```

**Step 3: Generate JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output to JWT_SECRET in .env
```

**Step 4: Test backend locally**
```bash
npm run dev  # or npm start
```

Visit `http://localhost:5000/api/auth/me` to test (should show auth error, which is expected).

### 2. Frontend Production Build

**Step 1: Build React app**
```bash
cd frontend
npm install
npm run build
```

This creates an optimized production build in the `build/` folder.

**Step 2: Test production build locally**
```bash
npm install -g serve
serve -s build -l 3000
```

---

## Heroku Deployment

### 1. Backend Deployment

**Step 1: Create Heroku app**
```bash
# Install Heroku CLI if not already installed
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create healthtrack-api
```

**Step 2: Set environment variables**
```bash
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthtrack
heroku config:set JWT_SECRET=your-generated-secret-key
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://healthtrack-frontend.herokuapp.com
```

**Step 3: Deploy code**
```bash
cd backend
git push heroku main
# or if you're on master branch
git push heroku master
```

**Step 4: Verify deployment**
```bash
heroku logs --tail
# Should show "Server listening on port 5000"
```

Check backend URL: `https://healthtrack-api.herokuapp.com/api/auth/me`

### 2. Frontend Deployment to Heroku

```bash
# Create Procfile in frontend directory if needed
echo "web: npm start" > frontend/Procfile

cd frontend
heroku create healthtrack-app

# Set buildpack for React
heroku buildpacks:set mars/create-react-app

# Deploy
git push heroku main

# View live app
heroku open
```

---

## AWS Deployment

### Option A: Using Elastic Beanstalk

**Step 1: Install AWS Elastic Beanstalk CLI**
```bash
pip install awsebcli --upgrade --user
```

**Step 2: Initialize EB app**
```bash
cd backend
eb init -p node.js-14 healthtrack --region us-east-1
```

**Step 3: Create environment**
```bash
eb create healthtrack-env
```

**Step 4: Set environment variables**
```bash
eb setenv MONGODB_URI=mongodb+srv://... JWT_SECRET=... NODE_ENV=production
```

**Step 5: Deploy**
```bash
eb deploy
```

**Step 6: View logs**
```bash
eb logs
```

### Option B: Using EC2 + Manual Setup

**Step 1: Launch EC2 instance**
- Choose Ubuntu 20.04 LTS
- Use t2.micro (free tier) or t2.small for production
- Configure security group to allow ports 22, 80, 443, 5000

**Step 2: SSH into instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

**Step 3: Install dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
node --version

# Install npm packages
npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

**Step 4: Deploy application**
```bash
# Clone repository
git clone <your-repo-url>
cd Mongo\ Project/healthtrack/backend
npm install --production

# Create .env file
nano .env
# Add all environment variables
```

**Step 5: Use PM2 to keep app running**
```bash
pm2 start index.js --name "healthtrack-api"
pm2 startup
pm2 save
```

**Step 6: Configure Nginx reverse proxy**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Step 7: Test and restart Nginx**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## Digital Ocean Deployment

**Step 1: Create Droplet**
- Size: Basic $6/month (2GB RAM, 1 vCPU)
- OS: Ubuntu 20.04
- Enable IPv6
- Add SSH key

**Step 2: SSH into droplet**
```bash
ssh -i ~/.ssh/id_rsa root@your-droplet-ip
```

**Step 3: Setup server**
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

**Step 4: Clone and deploy application**
```bash
cd /var/www
git clone <your-repo-url>
cd Mongo\ Project/healthtrack/backend
npm install --production

# Create .env file with production config
nano .env
```

**Step 5: Setup PM2 & Nginx** (same as EC2 steps above)

**Step 6: Get SSL certificate**
```bash
certbot --nginx -d yourdomain.com
```

---

## Database Management

### Setting up MongoDB Atlas (Cloud)

**Step 1: Create Atlas account**
- Go to mongodb.com/cloud/atlas
- Create free account
- Create cluster (M0 Sandbox - free tier)

**Step 2: Configure database user**
- Go to Database Access
- Create database user with strong password
- Save credentials securely

**Step 3: Configure network access**
- Go to Network Access
- Add IP address (or 0.0.0.0/0 for development, restrict for production)

**Step 4: Get connection string**
- Click "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace username:password with your credentials

**Step 5: Create database backup**
```bash
# In MongoDB Atlas dashboard
# Enable automatic daily backups
# Project Settings > Backup
```

### Local MongoDB on Production Server

```bash
# Install MongoDB
curl https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt update && apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod  # Auto-start on reboot

# Create database and user
mongosh
use healthtrack
db.createUser({
  user: "healthtrack_user",
  pwd: "strong-password",
  roles: [{role: "readWrite", db: "healthtrack"}]
})
exit
```

---

## Security Checklist

### Before Deploying to Production

**1. Environment Variables**
- [ ] JWT_SECRET is strong (min 32 chars)
- [ ] MONGODB_URI uses authentication
- [ ] NODE_ENV is set to "production"
- [ ] No hardcoded secrets in code

**2. MongoDB Security**
- [ ] IP whitelist configured
- [ ] Database user has limited permissions
- [ ] Enable MongoDB authentication
- [ ] Regular backups configured

**3. Application Security**
- [ ] CORS configured for specific domains
- [ ] HTTPS/SSL enabled
- [ ] Rate limiting configured
- [ ] Input validation enabled
- [ ] Password hashing confirmed (bcryptjs)
- [ ] JWT expiration set

**4. Server Security**
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key-based auth (disable password auth)
- [ ] Keep system packages updated
- [ ] Enable fail2ban for brute force protection
- [ ] Setup monitoring/alerts

**5. API Security**
- [ ] Remove DEBUG mode
- [ ] Implement request limiting
- [ ] Add API key authentication for sensitive endpoints
- [ ] Log security events
- [ ] Monitor error logs

### Enabling SSL/HTTPS

**Using Let's Encrypt (Free)**
```bash
# On your server
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
```

**Update Nginx config**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    location / {
        proxy_pass http://localhost:5000;
    }
}
```

---

## Monitoring & Logging

### Application Logging

**Update backend/index.js to use logging**
```javascript
const fs = require('fs');

// Create logs directory
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Winston logger setup
const logger = require('winston');

logger.configure({
  transports: [
    new logger.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new logger.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Catch unhandled exceptions
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### Monitor Application Health

**Setup MongoDB monitoring**
```bash
# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/healthtrack" --eval "db.adminCommand('ping')"
```

**Setup Server monitoring**
- Use New Relic, DataDog, or open-source tools
- Monitor CPU, memory, disk usage
- Setup alerts for high resource usage

### View Logs

**Heroku**
```bash
heroku logs -t  # Real-time logs
```

**AWS Elastic Beanstalk**
```bash
eb logs
```

**Ubuntu Server (PM2)**
```bash
pm2 logs healthtrack-api
```

**Nginx logs**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Deployment Checklist

- [ ] Node.js version check
- [ ] All dependencies installed
- [ ] .env configured with production values
- [ ] MongoDB connection tested
- [ ] Build process succeeds
- [ ] No console errors
- [ ] HTTPS configured
- [ ] Security headers added
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Monitoring setup
- [ ] Backup strategy ready
- [ ] Logging configured
- [ ] Error handling tested
- [ ] Performance optimized
- [ ] Database indexes created
- [ ] Seed data imported
- [ ] Admin account created
- [ ] Documentation updated
- [ ] Team trained on deployment

---

## Troubleshooting Deployment

### Problem: "Cannot find module"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: MongoDB connection fails
**Solution:**
- Check connection string is correct
- Verify IP is whitelisted in MongoDB Atlas
- Test connection: `mongosh your-connection-string`

### Problem: CORS errors
**Solution:**
- Update backend/index.js CORS settings
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Problem: High memory usage
**Solution:**
```bash
# Increase available memory
pm2 start index.js --max-memory-restart 500M

# Or use Nginx caching
# Or optimize database queries
```

### Problem: Slow API responses
**Solution:**
- Check MongoDB indexes
- Monitor query performance: `db.setProfilingLevel(1)`
- Use connection pooling
- Enable Nginx caching

---

## Rollback Procedure

**Git-based rollback**
```bash
# Find previous commit
git log --oneline -n 10

# Rollback to previous version
git revert <commit-hash>
git push heroku main
```

**Heroku rollback**
```bash
heroku releases  # View release history
heroku rollback  # Rollback to previous version
```

---

## Cost Estimation (Monthly)

| Service | Free | Small | Medium |
|---------|------|-------|--------|
| **Heroku** | $0 | $7-12 | $50+ |
| **AWS EC2** | $0* | $10-20 | $50+ |
| **Digital Ocean** | $0 | $6-12 | $24+ |
| **MongoDB Atlas** | $0 (shared) | $0-57 | $57+ |
| **Total** | $0* | $13-89 | $107+ |

*Free tier has limitations

---

**Deployment Guide Version:** 1.0  
**Last Updated:** January 2024
