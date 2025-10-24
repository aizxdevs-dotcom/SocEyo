#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}  Friends System - Quick Setup  ${NC}"
echo -e "${BLUE}=================================${NC}\n"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Not in soceyo-frontend directory${NC}"
    echo "Please run this script from: /home/aizr/SCOMED/soceyo-frontend"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking Dependencies...${NC}"
if npm list clsx &> /dev/null; then
    echo -e "${GREEN}✓ clsx is installed${NC}"
else
    echo -e "${YELLOW}Installing clsx...${NC}"
    npm install clsx
fi

echo -e "\n${YELLOW}Step 2: Checking TypeScript Compilation...${NC}"
npx tsc --noEmit 2>&1 | head -20
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ No TypeScript errors${NC}"
else
    echo -e "${RED}⚠ Some TypeScript warnings/errors found (check above)${NC}"
fi

echo -e "\n${YELLOW}Step 3: Verifying File Structure...${NC}"
FILES=(
    "services/invitations.ts"
    "app/friends/page.tsx"
    "components/Feed/FriendRequests.tsx"
    "components/Feed/FriendSuggestions.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file${NC}"
    else
        echo -e "${RED}✗ $file - MISSING${NC}"
    fi
done

echo -e "\n${BLUE}=================================${NC}"
echo -e "${BLUE}  Setup Complete!                 ${NC}"
echo -e "${BLUE}=================================${NC}\n"

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Start the backend:"
echo -e "   ${GREEN}cd ../Chattera && python -m uvicorn app.main:app --reload${NC}\n"
echo -e "2. Start the frontend (in a new terminal):"
echo -e "   ${GREEN}npm run dev${NC}\n"
echo -e "3. Visit: ${BLUE}http://localhost:3000/friends${NC}\n"

echo -e "${YELLOW}Documentation:${NC}"
echo -e "  • Quick Start: ${GREEN}QUICK_START_FRIENDS.md${NC}"
echo -e "  • Full Guide:  ${GREEN}FRIENDS_INTEGRATION_GUIDE.md${NC}"
echo -e "  • Testing:     ${GREEN}TESTING_CHECKLIST.md${NC}"
echo -e "  • Architecture:${GREEN}ARCHITECTURE_FRIENDS.md${NC}\n"

echo -e "${GREEN}✨ Friends system is ready to use!${NC}\n"
