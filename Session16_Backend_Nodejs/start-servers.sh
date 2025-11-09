#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Starting Session 16 Servers${NC}"
echo -e "${BLUE}================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill 0
    exit
}

trap cleanup SIGINT SIGTERM

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Start backend server
echo -e "${BLUE}🚀 Starting Backend Server (Port 3001)...${NC}"
cd "$SCRIPT_DIR/backend" && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo -e "${BLUE}🚀 Starting Frontend Server (Port 3000)...${NC}"
cd "$SCRIPT_DIR/frontend" && npm start &
FRONTEND_PID=$!

echo -e "\n${GREEN}================================${NC}"
echo -e "${GREEN}  ✅ Both servers are running!${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "${BLUE}  Backend:  http://localhost:3001${NC}"
echo -e "${BLUE}  Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}================================${NC}"
echo -e "${YELLOW}\n⚡ Press Ctrl+C to stop both servers${NC}\n"

# Wait for both processes
wait
