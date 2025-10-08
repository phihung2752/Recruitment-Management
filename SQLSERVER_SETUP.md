# 🗄️ SQL Server Setup Guide

## 📋 Prerequisites

1. **SQL Server 2019 or later** installed on your system
2. **SQL Server Management Studio (SSMS)** for database management
3. **Node.js** and **npm** installed

## 🚀 Quick Setup

### 1. Install SQL Server

#### Windows:
- Download SQL Server from [Microsoft](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- Install SQL Server Express (free) or Developer Edition
- During installation, set **sa** password: `YourStrong@Passw0rd`

#### Linux (Ubuntu/Debian):
```bash
# Install SQL Server
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/20.04/mssql-server-2022.list)"
sudo apt-get update
sudo apt-get install -y mssql-server

# Configure SQL Server
sudo /opt/mssql/bin/mssql-conf setup
```

#### Docker:
```bash
# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Passw0rd" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### 2. Configure Database

#### Option A: Using Script (Recommended)
```bash
# Set environment variables
export SQL_SERVER_HOST=localhost
export SQL_SERVER_PORT=1433
export SQL_SERVER_USER=sa
export SQL_SERVER_PASSWORD=YourStrong@Passw0rd
export SQL_SERVER_DATABASE=HRManagementDB

# Run setup script
npm run setup-sqlserver
```

#### Option B: Manual Setup
1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Open `database-schema-sqlserver.sql`
4. Execute the script to create database and tables

### 3. Start Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:
```env
# SQL Server Configuration
SQL_SERVER_HOST=localhost
SQL_SERVER_PORT=1433
SQL_SERVER_USER=sa
SQL_SERVER_PASSWORD=YourStrong@Passw0rd
SQL_SERVER_DATABASE=HRManagementDB

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

### Database Connection

The application uses the following connection settings:
- **Server**: localhost:1433
- **Database**: HRManagementDB
- **Authentication**: SQL Server Authentication
- **Username**: sa
- **Password**: YourStrong@Passw0rd

## 📊 Database Schema

The database includes the following tables:

### Core Tables
- **Users** - System users and authentication
- **Roles** - User roles (Admin, HR, Manager, Employee)
- **Permissions** - System permissions
- **RolePermissions** - Role-permission mapping

### HR Tables
- **Candidates** - Job applicants
- **InterviewRounds** - Interview scheduling and results
- **JobPostings** - Job advertisements
- **Employees** - Current employees
- **CVAnalysis** - CV analysis and AI scoring
- **CalendarEvents** - Calendar and scheduling

## 🔍 Verification

After setup, verify the database:

1. **Check Connection**:
   ```bash
   npm run setup-sqlserver
   ```

2. **Access Application**:
   - Open http://localhost:3000
   - Login with: `admin` / `admin123`

3. **Check Data**:
   - Dashboard should show statistics
   - Candidates page should show sample data
   - All features should work with real data

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Failed**:
   - Check SQL Server is running
   - Verify firewall settings (port 1433)
   - Confirm credentials

2. **Authentication Error**:
   - Enable SQL Server Authentication
   - Check sa account is enabled
   - Verify password

3. **Database Not Found**:
   - Run setup script again
   - Check database name in connection string
   - Verify user has permissions

### Reset Database

```bash
# Drop and recreate database
npm run setup-sqlserver
```

## 📈 Performance

### Recommended Settings

- **Memory**: 4GB+ RAM
- **CPU**: 2+ cores
- **Storage**: SSD recommended
- **Connection Pool**: 10-20 connections

### Optimization

1. **Indexes**: Automatically created on primary keys
2. **Connection Pooling**: Configured for optimal performance
3. **Query Optimization**: Uses parameterized queries

## 🔒 Security

### Best Practices

1. **Change Default Password**: Update sa password
2. **Use Windows Authentication**: If possible
3. **Enable Encryption**: For production
4. **Regular Backups**: Schedule database backups
5. **Firewall**: Restrict access to port 1433

### Production Setup

```env
# Production Environment Variables
SQL_SERVER_HOST=your-production-server
SQL_SERVER_PORT=1433
SQL_SERVER_USER=your-service-account
SQL_SERVER_PASSWORD=your-secure-password
SQL_SERVER_DATABASE=HRManagementDB_Prod
```

## 📞 Support

If you encounter issues:

1. Check the logs: `npm run dev`
2. Verify SQL Server status
3. Test connection manually
4. Check firewall and network settings

## 🎉 Success!

Once setup is complete, you'll have:
- ✅ Full HR Management System
- ✅ Real SQL Server database
- ✅ Sample data loaded
- ✅ All features working
- ✅ Production-ready setup

**Login Credentials**:
- Username: `admin`
- Password: `admin123`

**Database Access**:
- Server: `localhost:1433`
- Database: `HRManagementDB`
- Username: `sa`
- Password: `YourStrong@Passw0rd`

