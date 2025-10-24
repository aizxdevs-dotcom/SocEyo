# 🚀 Quick Command Reference

## Setup & Installation

```bash
# Navigate to frontend
cd /home/aizr/SCOMED/soceyo-frontend

# Run automated setup
./setup-friends.sh

# Manual dependency check (if needed)
npm install clsx
```

## Starting the Application

### Terminal 1: Backend
```bash
cd /home/aizr/SCOMED/Chattera
python -m uvicorn app.main:app --reload

# Alternative (with custom host/port)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2: Frontend
```bash
cd /home/aizr/SCOMED/soceyo-frontend
npm run dev

# Alternative (with custom port)
npm run dev -- -p 3001
```

## Accessing the Application

```bash
# Frontend
http://localhost:3000

# Friends Page
http://localhost:3000/friends

# Backend API
http://localhost:8000

# API Docs (Swagger)
http://localhost:8000/docs
```

## Development Commands

### Frontend

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Type checking
npx tsc --noEmit

# Lint code
npm run lint
```

### Backend

```bash
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
python -m uvicorn app.main:app --reload

# Run tests (if available)
pytest

# Database migrations (if needed)
# (depends on your setup)
```

## Testing Commands

```bash
# Open in browser
open http://localhost:3000/friends

# Check API health
curl http://localhost:8000/api/users/search?q=test

# View logs
tail -f ~/.npm/_logs/*.log
```

## Troubleshooting Commands

### Frontend Issues

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit

# Check for port conflicts
lsof -i :3000
```

### Backend Issues

```bash
# Check Python version
python --version

# Check Neo4j connection
curl http://localhost:8000/

# View backend logs
# (check terminal where uvicorn is running)

# Check port conflicts
lsof -i :8000

# Restart Neo4j (if needed)
# (depends on your Neo4j setup)
```

## File Operations

```bash
# View all created files
cat FILES_CREATED.txt

# Check file structure
tree -L 3 -I 'node_modules|.next|__pycache__'

# Find specific files
find . -name "*invitation*" -type f

# Check file sizes
du -sh app/ components/ services/
```

## Git Commands (Optional)

```bash
# Check status
git status

# View changes
git diff

# Stage new files
git add services/invitations.ts
git add app/friends/
git add components/Feed/

# Commit changes
git commit -m "feat: Add friends & invitation system"

# View commit log
git log --oneline
```

## Environment Commands

```bash
# Check environment variables
cat .env

# Edit environment
nano .env

# Example .env content:
# NEXT_PUBLIC_API_BASE_URL="http://127.0.0.1:8000/api"
# NEXT_PUBLIC_SOCKET_URL="http://127.0.0.1:8000"
```

## Documentation Commands

```bash
# View quick start
cat QUICK_START_FRIENDS.md

# View full guide
cat FRIENDS_INTEGRATION_GUIDE.md

# View testing checklist
cat TESTING_CHECKLIST.md

# View all documentation
ls -la *.md
```

## API Testing Commands

```bash
# Test user search (replace TOKEN with your JWT)
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8000/api/users/search?q=john"

# Test get friends
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8000/api/contacts/"

# Test get stats
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8000/api/contacts/stats"

# Test received invitations
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:8000/api/invitations/received"
```

## Useful Shortcuts

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 8000
npx kill-port 8000

# Open multiple terminals (using tmux)
tmux new -s soceyo
# Then: Ctrl+B, then C for new window
# Ctrl+B, then N to switch windows

# Run both servers in background
cd /home/aizr/SCOMED/Chattera && python -m uvicorn app.main:app --reload &
cd /home/aizr/SCOMED/soceyo-frontend && npm run dev &
```

## Debugging Commands

```bash
# Check if backend is running
curl http://localhost:8000

# Check if frontend is running
curl http://localhost:3000

# View real-time logs
tail -f /path/to/logfile

# Check system resources
top
htop  # if installed

# Check disk space
df -h
```

## Performance Commands

```bash
# Analyze bundle size (frontend)
npm run build
# Check .next/static output

# Profile API performance
time curl http://localhost:8000/api/contacts/

# Monitor network requests
# (use browser DevTools Network tab)
```

## Cleanup Commands

```bash
# Clean frontend build
rm -rf .next

# Clean Python cache
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete

# Clean npm cache
npm cache clean --force

# Full reset (careful!)
rm -rf node_modules .next
npm install
```

## Quick Access Scripts

```bash
# Create aliases (add to ~/.bashrc or ~/.zshrc)
alias soceyo-frontend="cd /home/aizr/SCOMED/soceyo-frontend && npm run dev"
alias soceyo-backend="cd /home/aizr/SCOMED/Chattera && python -m uvicorn app.main:app --reload"
alias soceyo-logs="tail -f /home/aizr/SCOMED/Chattera/logs/*.log"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

## One-Line Setup

```bash
# Complete setup and start (run in two terminals)
# Terminal 1:
cd /home/aizr/SCOMED/Chattera && python -m uvicorn app.main:app --reload

# Terminal 2:
cd /home/aizr/SCOMED/soceyo-frontend && npm run dev && open http://localhost:3000/friends
```

## Emergency Commands

```bash
# Force kill all Node processes
pkill -9 node

# Force kill all Python processes
pkill -9 python

# Restart system services (if needed)
# sudo systemctl restart neo4j
# sudo systemctl restart redis

# Check system logs
journalctl -xe
```

---

## 📋 Common Workflows

### Starting Work
```bash
cd /home/aizr/SCOMED/Chattera && python -m uvicorn app.main:app --reload &
cd /home/aizr/SCOMED/soceyo-frontend && npm run dev &
```

### Making Changes
```bash
# Edit files with VS Code
code /home/aizr/SCOMED/soceyo-frontend

# Hot reload is automatic!
```

### Testing Changes
```bash
# Visit in browser
open http://localhost:3000/friends

# Check console for errors (in browser)
# Check terminal for backend errors
```

### Stopping Servers
```bash
# Press Ctrl+C in each terminal
# Or:
pkill -f "uvicorn"
pkill -f "next"
```

---

**Save this file for quick reference!** 📌
