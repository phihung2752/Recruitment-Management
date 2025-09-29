#!/bin/bash

echo "🚀 Starting HR Management System"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Check if backend is already running
if check_port 7001; then
    print_warning "Backend already running on port 7001"
else
    print_header "🔧 Starting Backend..."
    cd Backend/HRManagement.API
    
    # Start backend in background
    print_status "Starting .NET API server..."
    dotnet run --urls="https://localhost:7001" > ../../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 5
    
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_status "Backend started successfully (PID: $BACKEND_PID)"
        echo $BACKEND_PID > ../../logs/backend.pid
    else
        print_error "Failed to start backend. Check logs/backend.log"
        exit 1
    fi
    
    cd ../../
fi

# Check if frontend is already running
if check_port 3000; then
    print_warning "Frontend already running on port 3000"
else
    print_header "🎨 Starting Frontend..."
    
    # Start frontend in background
    print_status "Starting Next.js development server..."
    npm run dev > logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    # Wait a moment for frontend to start
    sleep 5
    
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_status "Frontend started successfully (PID: $FRONTEND_PID)"
        echo $FRONTEND_PID > logs/frontend.pid
    else
        print_error "Failed to start frontend. Check logs/frontend.log"
        exit 1
    fi
fi

print_header "✅ System Started Successfully!"
echo ""
print_status "🔗 Access URLs:"
echo "   Backend API: https://localhost:7001"
echo "   Frontend:    http://localhost:3000"
echo "   Swagger UI:  https://localhost:7001/swagger"
echo ""
print_status "📊 Monitoring:"
echo "   Backend logs:  tail -f logs/backend.log"
echo "   Frontend logs: tail -f logs/frontend.log"
echo ""
print_status "🛑 To stop the system: ./scripts/stop.sh"
