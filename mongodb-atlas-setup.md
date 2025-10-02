# MongoDB Atlas Setup (Free Tier)

## 1. Create MongoDB Atlas Account
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Sign up for free account
- Create new project

## 2. Create Cluster
- Choose "Build a Database"
- Select "M0 Sandbox" (Free tier)
- Choose AWS as cloud provider
- Select region closest to your EC2 instance
- Name your cluster (e.g., "devtinder-cluster")

## 3. Configure Database Access
- Go to "Database Access"
- Add new database user
- Choose "Password" authentication
- Username: `devtinder-user`
- Generate secure password
- Grant "Read and write to any database" role

## 4. Configure Network Access
- Go to "Network Access"
- Add IP Address
- Choose "Allow access from anywhere" (0.0.0.0/0)
- Or add your EC2 instance IP specifically

## 5. Get Connection String
- Go to "Clusters" > "Connect"
- Choose "Connect your application"
- Copy connection string
- Replace `<password>` with your database user password
- Replace `<dbname>` with your database name (e.g., "devtinder")

## 6. Update Backend .env
```bash
DATABASE_URL=mongodb+srv://devtinder-user:<password>@devtinder-cluster.xxxxx.mongodb.net/devtinder?retryWrites=true&w=majority
```

## 7. Test Connection
```bash
# On your EC2 instance
cd devTinder-backend
node -e "require('./config/database')().then(() => console.log('✅ Connected to MongoDB Atlas')).catch(err => console.error('❌ Connection failed:', err))"
```