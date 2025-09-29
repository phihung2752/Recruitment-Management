#!/bin/bash

echo "🛑 Stopping HR Management System"
echo "================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Stop backend
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_status "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm logs/backend.pid
    else
        print_error "Backend process not found"
    fi
else
    print_status "No backend PID file found"
fi

# Stop frontend
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_status "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm logs/frontend.pid
    else
        print_error "Frontend process not found"
    fi
else
    print_status "No frontend PID file found"
fi

# Kill any remaining processes on the ports
print_status "Cleaning up remaining processes..."

# Kill processes on port 7001 (backend)
if lsof -ti:7001 >/dev/null 2>&1; then
    lsof -ti:7001 | xargs kill -9 2>/dev/null
    print_status "Cleaned up port 7001"
fi

# Kill processes on port 3000 (frontend)
if lsof -ti:3000 >/dev/null 2>&1; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    print_status "Cleaned up port 3000"
fi

print_status "✅ System stopped successfully"
