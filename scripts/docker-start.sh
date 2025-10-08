#!/bin/bash

echo "🚀 Starting HR Management System with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 30

# Setup database
echo "🔧 Setting up database..."
docker-compose exec hr_app node scripts/docker-setup-db.js

echo ""
echo "🎉 HR Management System is now running!"
echo ""
echo "📋 Access Information:"
echo "  🌐 Application: http://localhost:3001"
echo "  🗄️  Database Admin: http://localhost:8080"
echo "  👤 Login: admin / admin123"
echo ""
echo "📊 Services:"
echo "  ✅ HR App: http://localhost:3001"
echo "  ✅ MySQL: localhost:3306"
echo "  ✅ Adminer: http://localhost:8080"
echo ""
echo "🔧 Management Commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop: docker-compose down"
echo "  Restart: docker-compose restart"
echo "  Rebuild: docker-compose up --build -d"




