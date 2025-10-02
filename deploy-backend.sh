#!/bin/bash

# Backend Deployment Script for AWS EC2

echo "🚀 Backend Deployment Guide for AWS EC2"

echo "1️⃣ Launch EC2 Instance:"
echo "   - Go to AWS Console > EC2"
echo "   - Launch Ubuntu 22.04 LTS instance"
echo "   - Choose t2.micro (free tier)"
echo "   - Create/select key pair"
echo "   - Allow HTTP, HTTPS, SSH in security group"

echo "2️⃣ Connect to EC2 and setup:"
echo "   ssh -i your-key.pem ubuntu@your-ec2-ip"

echo "3️⃣ Run these commands on EC2:"
cat > ec2-setup.sh << 'EOF'
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Clone your repository
git clone https://github.com/your-username/devTinder-backend.git
cd devTinder-backend

# Install dependencies
npm install

# Create production environment file
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
ENVEOF

# Start application with PM2
pm2 start app.js --name "devtinder-backend"
pm2 startup
pm2 save

# Configure Nginx
sudo tee /etc/nginx/sites-available/devtinder << 'NGINXEOF'
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

# Enable site
sudo ln -s /etc/nginx/sites-available/devtinder /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Backend deployed on EC2!"
EOF

echo "📋 Copy ec2-setup.sh to your EC2 instance and run it"