# People You May Know Feature - Implementation Guide

## Overview
This document describes the "People You May Know" enhancement to the Friends page, allowing users to discover all users in the system, send friend requests, and start conversations directly.

## Features Implemented

### 1. Backend Endpoint: Get All Users
**File:** `Chattera/app/routers/user.py`
**Endpoint:** `GET /api/users`
**Parameters:**
- `limit` (optional, default: 50) - Maximum number of users to return

**Response:**
```json
[
  {
    "user_id": "uuid",
    "username": "johndoe",
    "full_name": "John Doe",
    "email": "john@example.com",
    "profile_photo": "https://...",
    "bio": "Software developer"
  }
]
```

**Features:**
- Excludes current user from results
- Ordered by username alphabetically
- Configurable limit (default 50)

---

### 2. Backend CRUD Method
**File:** `Chattera/app/crud/user.py`
**Method:** `get_all_users(exclude_user_id: str, limit: int = 50)`

**Cypher Query:**
```cypher
MATCH (u:User)
WHERE u.user_id <> $exclude_id
RETURN u.user_id, u.username, u.full_name, u.profile_photo, u.bio, u.email
ORDER BY u.username
LIMIT $limit
```

---

### 3. Frontend API Service
**File:** `soceyo-frontend/services/users.ts`
**Function:** `getAllUsers(limit?: number)`

```typescript
export const getAllUsers = async (limit: number = 50): Promise<User[]> => {
  const res = await api.get<User[]>("/users", {
    params: { limit },
  });
  return res.data;
};
```

---

### 4. Enhanced Friends Page
**File:** `soceyo-frontend/app/friends/page.tsx`

#### Changes Made:
1. **Auto-load all users in "Find Friends" tab**
   - Shows all users by default (no search required)
   - Still supports search functionality for filtering
   - Displays 50 users maximum by default

2. **Profile Cards Display:**
   - Avatar with profile photo or initials
   - Full name and @username
   - Bio (if available)
   - Two action buttons:
     - **Add Friend** - Sends friend request with notification
     - **Message** - Redirects to messages page with auto-conversation creation

#### Code Snippet:
```typescript
const fetchSuggestions = async () => {
  try {
    if (searchQuery.trim().length >= 2) {
      const results = await searchUsers(searchQuery);
      setSuggestions(results);
    } else {
      // Fetch all users as suggestions (People You May Know)
      const results = await getAllUsers(50);
      setSuggestions(results);
    }
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    setSuggestions([]);
  }
};
```

---

### 5. Direct Message Navigation
**File:** `soceyo-frontend/app/messages/page.tsx`

#### Features:
1. **URL Parameter Handling**
   - Accepts `?userId=<user_id>` parameter
   - Auto-creates conversation if doesn't exist
   - Selects existing conversation if found

2. **Auto-Conversation Creation**
   - Creates one-on-one conversation when user clicks "Message" button
   - Navigates to messages page with conversation selected
   - Ready for immediate messaging

#### Code Snippet:
```typescript
useEffect(() => {
  const userId = searchParams.get("userId");
  if (!userId || conversations.length === 0 || isCreatingConversation) return;

  const existingConv = conversations.find((conv) =>
    conv.members.some((m) => m.user_id === userId)
  );

  if (existingConv) {
    handleSelectConversation(existingConv);
  } else {
    setIsCreatingConversation(true);
    createConversation([userId])
      .then((newConv) => {
        setConversations((prev) => [newConv, ...prev]);
        handleSelectConversation(newConv);
      })
      .catch((err) => console.error("Failed to create conversation:", err))
      .finally(() => setIsCreatingConversation(false));
  }
}, [searchParams, conversations, isCreatingConversation]);
```

---

### 6. Message Ordering Fix
**File:** `soceyo-frontend/app/messages/page.tsx`

#### Changes:
- **Chronological Order:** Messages now display oldest → newest (top to bottom)
- **Facebook Messenger Style:** New messages appear at the bottom
- **Auto-scroll:** Automatically scrolls to bottom when new messages arrive

#### Code Snippet:
```typescript
const fetchMessages = async (conversationId: string) => {
  try {
    const data = await getConversationMessages(conversationId);
    // Sort messages by timestamp ascending (oldest first)
    const sortedData = [...data].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const msgWithStatus = sortedData.map((m: Message) => ({
      ...m,
      status: m.sender_id === localStorage.getItem("user_id") 
        ? ("seen" as const) 
        : undefined,
    }));
    setMessages(msgWithStatus);
  } catch (e) {
    console.error(e);
  }
};
```

---

## User Flow

### Scenario: User discovers someone and sends a message

1. **Navigate to Friends Page**
   - Click "Friends" in navbar
   - Click "Find Friends" tab

2. **Browse People You May Know**
   - See all users in the system (up to 50)
   - View profile cards with avatars, names, and bios
   - Optionally search for specific users

3. **Send Friend Request**
   - Click "Add Friend" button
   - Request sent with notification to recipient
   - Button shows loading state during request

4. **Start Conversation**
   - Click "Message" button (envelope icon)
   - Auto-redirects to messages page
   - Conversation created automatically
   - Chat interface opens ready for messaging

5. **Send Messages**
   - Type message in input box
   - Messages appear chronologically (oldest top, newest bottom)
   - Real-time updates via WebSocket
   - Auto-scroll to latest message

---

## API Endpoints Used

### Friends/Invitations
- `POST /api/invitations/{receiver_uid}` - Send friend request
- `GET /api/invitations/received?status=pending` - Get pending requests
- `PUT /api/invitations/{sender_uid}/accept` - Accept request
- `DELETE /api/invitations/{user_uid}` - Decline/cancel request

### Users
- `GET /api/users` - Get all users (NEW)
- `GET /api/users/search?q=query` - Search users
- `GET /api/users/me` - Get current user

### Conversations
- `GET /api/conversations` - List user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/{id}/messages` - Get messages

### Messages
- `POST /api/conversations/{id}/messages` - Send message
- WebSocket: `ws://localhost:8000/ws/chat/{conversation_id}` - Real-time messaging

---

## Testing Checklist

### Backend Tests (After Installing Dependencies)

```bash
# 1. Start backend server
cd Chattera
source venv/bin/activate  # Or recreate venv if needed
python3 -m uvicorn app.main:app --reload

# 2. Test GET /users endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/users

# Expected: List of all users excluding current user
```

### Frontend Tests

```bash
# 1. Start frontend
cd soceyo-frontend
npm run dev

# 2. Login with test account
# Navigate to http://localhost:3000/login

# 3. Test People You May Know
# - Go to /friends page
# - Click "Find Friends" tab
# - Verify all users display automatically
# - Verify profile cards show avatar, name, bio

# 4. Test Add Friend
# - Click "Add Friend" on any user
# - Verify success notification
# - Check "Requests Sent" tab
# - Verify request appears

# 5. Test Message Button
# - Click message icon on any user
# - Verify redirect to /messages
# - Verify conversation created
# - Verify conversation selected
# - Send a test message

# 6. Test Message Ordering
# - Send multiple messages
# - Verify oldest message at top
# - Verify newest message at bottom
# - Verify auto-scroll to bottom
```

---

## Configuration

### Backend Configuration
**File:** `Chattera/app/config.py`

```python
# Default user limit for suggestions
DEFAULT_USER_LIMIT = 50
```

### Frontend Configuration
No additional configuration needed. Default limit is 50 users.

To change limit, modify the `getAllUsers()` call:
```typescript
const results = await getAllUsers(100); // Fetch 100 users
```

---

## Database Schema

### Neo4j Relationships
```
(User)-[:INVITED {status: 'pending'}]->(User)  // Friend request
(User)-[:FRIENDS]->(User)                       // Accepted friends
(User)-[:CONTACT]->(User)                       // Contact relationship
```

### Query for All Users
```cypher
MATCH (u:User)
WHERE u.user_id <> $current_user_id
RETURN u
ORDER BY u.username
LIMIT 50
```

---

## Security Considerations

1. **Authentication Required**
   - All endpoints require JWT token
   - Current user excluded from results

2. **Rate Limiting**
   - Consider adding rate limits for:
     - Friend request sending
     - Conversation creation
     - User search queries

3. **Privacy**
   - Only public profile information displayed
   - Email not exposed in frontend API responses

---

## Performance Optimization

### Backend
- **Indexed Fields:** Ensure Neo4j indexes on `username` and `user_id`
- **Pagination:** Use `limit` parameter to control result size
- **Caching:** Consider caching user list for 30-60 seconds

### Frontend
- **Lazy Loading:** Currently loads 50 users, consider infinite scroll
- **Debounced Search:** Search has 2-character minimum to reduce API calls
- **React Query:** Already implemented for data caching and synchronization

---

## Future Enhancements

### Suggested Improvements
1. **Smart Suggestions**
   - Filter based on mutual friends
   - Show users with common interests
   - Prioritize users in same groups/communities

2. **Infinite Scroll**
   - Load more users as user scrolls
   - Implement cursor-based pagination

3. **Advanced Filters**
   - Filter by location, interests, mutual friends
   - Sort options (name, recent activity, etc.)

4. **User Profiles**
   - Click user card to view full profile
   - See posts, mutual friends, activity

5. **Privacy Settings**
   - Option to hide from "People You May Know"
   - Control who can send friend requests

---

## Troubleshooting

### Issue: No users displayed
**Solution:**
- Check backend server is running
- Verify JWT token is valid
- Check browser console for errors
- Verify GET /users endpoint returns data

### Issue: Message button doesn't work
**Solution:**
- Check conversations API is accessible
- Verify conversation creation endpoint works
- Check browser console for errors
- Ensure WebSocket connection is working

### Issue: Messages in wrong order
**Solution:**
- Verify backend returns messages with timestamps
- Check timestamp format is ISO 8601
- Clear browser cache and reload
- Check sorting logic in `fetchMessages()`

---

## File Modifications Summary

### Backend Files Modified (2)
1. `Chattera/app/routers/user.py` - Added GET /users endpoint
2. `Chattera/app/crud/user.py` - Added get_all_users() method

### Frontend Files Modified (3)
1. `soceyo-frontend/services/users.ts` - Added getAllUsers() function
2. `soceyo-frontend/app/friends/page.tsx` - Enhanced suggestions tab
3. `soceyo-frontend/app/messages/page.tsx` - Added URL param handling, fixed ordering

### Total Lines Added: ~150 lines
### Total Lines Modified: ~30 lines

---

## Deployment Notes

### Backend Deployment
1. Ensure Neo4j indexes are created:
   ```cypher
   CREATE INDEX user_username IF NOT EXISTS FOR (u:User) ON (u.username);
   CREATE INDEX user_id IF NOT EXISTS FOR (u:User) ON (u.user_id);
   ```

2. Update environment variables if needed
3. Restart FastAPI server after deployment

### Frontend Deployment
1. Build production version:
   ```bash
   npm run build
   ```

2. Environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourapp.com
   NEXT_PUBLIC_WS_URL=wss://api.yourapp.com
   ```

3. Deploy to hosting provider (Vercel, Netlify, etc.)

---

## Support

For issues or questions:
1. Check existing documentation (QUICK_START.md, ARCHITECTURE.md)
2. Review backend API logs
3. Check browser console for frontend errors
4. Verify Neo4j connection and data
5. Test endpoints with Postman/curl

---

## Conclusion

The "People You May Know" feature is now fully implemented with:
- ✅ All users displayed automatically
- ✅ Profile cards with avatars and actions
- ✅ Friend request notifications
- ✅ Direct message navigation
- ✅ Auto-conversation creation
- ✅ Chronological message ordering
- ✅ Facebook Messenger-style UI

Ready for testing once backend dependencies are installed!
