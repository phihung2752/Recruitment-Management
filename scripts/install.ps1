# HR Management System - Windows Installation Script
Write-Host "🚀 HR Management System - Windows Installation Script" -ForegroundColor Blue
Write-Host "======================================================" -ForegroundColor Blue

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

# Step 1: Check prerequisites
Write-Header "📋 Checking Prerequisites..."

# Check .NET 8
try {
    $dotnetVersion = dotnet --version
    Write-Status ".NET SDK found: $dotnetVersion"
} catch {
    Write-Error ".NET 8 SDK not found. Please install from https://dotnet.microsoft.com/download"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Status "Node.js found: $nodeVersion"
} catch {
    Write-Error "Node.js not found. Please install from https://nodejs.org"
    exit 1
}

# Check MySQL
try {
    mysql --version | Out-Null
    Write-Status "MySQL client found"
} catch {
    Write-Warning "MySQL client not found. Please ensure MySQL Server is installed and running."
}

# Step 2: Setup Backend
Write-Header "🔧 Setting up Backend..."

Set-Location "Backend\HRManagement.API"

# Restore packages
Write-Status "Restoring .NET packages..."
dotnet restore

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to restore .NET packages"
    exit 1
}

# Build project
Write-Status "Building backend project..."
dotnet build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build backend project"
    exit 1
}

# Step 3: Database setup
Write-Header "🗄️ Setting up Database..."

# Check if appsettings.json exists
if (!(Test-Path "appsettings.json")) {
    Write-Warning "appsettings.json not found. Creating from template..."
    Copy-Item "appsettings.Development.json" "appsettings.json"
}

# Run database migrations
Write-Status "Running database migrations..."
dotnet ef database update

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Database migration failed. Please check your connection string and MySQL server."
}

# Step 4: Setup Frontend
Write-Header "🎨 Setting up Frontend..."

Set-Location "..\.."

# Install npm packages
Write-Status "Installing npm packages..."
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to install npm packages"
    exit 1
}

# Create .env.local if not exists
if (!(Test-Path ".env.local")) {
    Write-Status "Creating .env.local file..."
    @"
NEXT_PUBLIC_API_URL=https://localhost:7001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here
"@ | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Warning "Please update .env.local with your actual Google Client ID"
}

# Step 5: Final setup
Write-Header "✅ Final Setup..."

# Create logs directory
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
}

Write-Header "🎉 Installation Complete!"
Write-Host ""
Write-Status "Next steps:"
Write-Host "1. Update Backend\HRManagement.API\appsettings.json with your database connection"
Write-Host "2. Update .env.local with your Google OAuth credentials"
Write-Host "3. Run the backend: cd Backend\HRManagement.API && dotnet run"
Write-Host "4. Run the frontend: npm run dev"
Write-Host ""
Write-Status "Backend will be available at: https://localhost:7001"
Write-Status "Frontend will be available at: http://localhost:3000"
Write-Host ""
Write-Warning "Don't forget to configure Google OAuth credentials!"
