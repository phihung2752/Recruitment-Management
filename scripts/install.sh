#!/bin/bash

echo "🚀 HR Management System - Installation Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if running on Windows (Git Bash/WSL)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    print_warning "Detected Windows environment. Some commands may need adjustment."
fi

# Step 1: Check prerequisites
print_header "📋 Checking Prerequisites..."

# Check .NET 8
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    print_status ".NET SDK found: $DOTNET_VERSION"
else
    print_error ".NET 8 SDK not found. Please install from https://dotnet.microsoft.com/download"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    print_status "MySQL client found"
else
    print_warning "MySQL client not found. Please ensure MySQL Server is installed and running."
fi

# Step 2: Setup Backend
print_header "🔧 Setting up Backend..."

cd Backend/HRManagement.API

# Restore packages
print_status "Restoring .NET packages..."
dotnet restore

if [ $? -ne 0 ]; then
    print_error "Failed to restore .NET packages"
    exit 1
fi

# Build project
print_status "Building backend project..."
dotnet build

if [ $? -ne 0 ]; then
    print_error "Failed to build backend project"
    exit 1
fi

# Step 3: Database setup
print_header "🗄️ Setting up Database..."

# Check if appsettings.json exists
if [ ! -f "appsettings.json" ]; then
    print_warning "appsettings.json not found. Creating from template..."
    cp appsettings.Development.json appsettings.json
fi

# Run database migrations
print_status "Running database migrations..."
dotnet ef database update

if [ $? -ne 0 ]; then
    print_warning "Database migration failed. Please check your connection string and MySQL server."
fi

# Step 4: Setup Frontend
print_header "🎨 Setting up Frontend..."

cd ../../

# Install npm packages
print_status "Installing npm packages..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install npm packages"
    exit 1
fi

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=https://localhost:7001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
EOL
    print_warning "Please update .env.local with your actual Google Client ID"
fi

# Step 5: Final setup
print_header "✅ Final Setup..."

# Create logs directory
mkdir -p logs

# Set permissions (Linux/Mac only)
if [[ "$OSTYPE" != "msys" && "$OSTYPE" != "win32" ]]; then
    chmod +x scripts/*.sh
fi

print_header "🎉 Installation Complete!"
echo ""
print_status "Next steps:"
echo "1. Update Backend/HRManagement.API/appsettings.json with your database connection"
echo "2. Update .env.local with your Google OAuth credentials"
echo "3. Run the backend: cd Backend/HRManagement.API && dotnet run"
echo "4. Run the frontend: npm run dev"
echo ""
print_status "Backend will be available at: https://localhost:7001"
print_status "Frontend will be available at: http://localhost:3000"
echo ""
print_warning "Don't forget to configure Google OAuth credentials!"
