# Friends System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  /friends    │  │  Navbar      │  │  Feed Page   │          │
│  │  Main Page   │  │  Navigation  │  │  (Optional)  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         │                  │                  │                   │
│  ┌──────▼──────────────────▼──────────────────▼───────┐         │
│  │          Services Layer (API Clients)              │         │
│  │  ┌─────────────────┐  ┌────────────────┐          │         │
│  │  │ invitations.ts  │  │   users.ts     │          │         │
│  │  │ • sendFriend    │  │ • searchUsers  │          │         │
│  │  │ • getReceived   │  │                │          │         │
│  │  │ • getSent       │  └────────────────┘          │         │
│  │  │ • accept        │                               │         │
│  │  │ • decline       │                               │         │
│  │  │ • cancel        │                               │         │
│  │  │ • getAllFriends │                               │         │
│  │  │ • getStats      │                               │         │
│  │  │ • removeFriend  │                               │         │
│  │  └─────────────────┘                               │         │
│  └────────────────────┬────────────────────────────────┘        │
│                       │ HTTP/HTTPS                               │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        │ JWT Bearer Token
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                      BACKEND (FastAPI)                            │
├───────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API Routers                            │   │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌────────────┐  │   │
│  │  │ invitation.py   │  │ contact.py   │  │  user.py   │  │   │
│  │  │                 │  │              │  │            │  │   │
│  │  │ POST /send      │  │ GET /        │  │ GET /search│  │   │
│  │  │ GET /received   │  │ GET /stats   │  │            │  │   │
│  │  │ GET /sent       │  │ DELETE /{id} │  └────────────┘  │   │
│  │  │ POST /{id}/accept│  │              │                  │   │
│  │  │ POST /{id}/decline│ │              │                  │   │
│  │  │ DELETE /{id}/cancel│ │             │                  │   │
│  │  └─────────────────┘  └──────────────┘                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌───────────────────────────▼──────────────────────────────┐   │
│  │                      CRUD Layer                           │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │   │
│  │  │invitation.py│  │ contact.py  │  │   user.py   │      │   │
│  │  │             │  │             │  │             │      │   │
│  │  │ • send      │  │ • list      │  │ • search    │      │   │
│  │  │ • respond   │  │ • isFriend  │  │ • getById   │      │   │
│  │  │ • cancel    │  │ • remove    │  │ • update    │      │   │
│  │  │ • listSent  │  │ • getCount  │  └─────────────┘      │   │
│  │  │ • listRec'd │  │ • getMutual │                        │   │
│  │  └─────────────┘  └─────────────┘                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               │ Cypher Queries
                               │
                        ┌──────▼──────┐
                        │   Neo4j     │
                        │   Database  │
                        │             │
                        │  Nodes:     │
                        │  • User     │
                        │             │
                        │  Edges:     │
                        │  • FRIENDS  │
                        │  • INVITED  │
                        └─────────────┘
```

## Data Models

### User Node (Neo4j)
```
User {
  user_id: UUID (unique)
  username: String
  email: String (unique)
  full_name: String
  bio: String
  profile_photo: String (S3 URL)
  password_hash: String
  created_at: DateTime
}
```

### Relationships

#### INVITED
```
(User)-[INVITED {
  status: "pending" | "accepted" | "declined"
  message: String (optional)
  created_at: DateTime
}]->(User)
```

#### FRIENDS
```
(User)-[FRIENDS {
  since: DateTime
}]-(User)
```

## Component Hierarchy

```
App
├── Navbar
│   └── Friends Link (Purple Icon)
│
├── /feed
│   ├── CreatePostForm
│   ├── PostCard (multiple)
│   └── Sidebar (optional)
│       ├── FriendRequests Widget
│       └── FriendSuggestions Widget
│
└── /friends
    ├── Header
    │   └── Stats Cards (Total Friends, Requests, Sent)
    │
    ├── Sidebar Navigation
    │   ├── Find Friends Tab
    │   ├── All Friends Tab
    │   ├── Requests Tab
    │   └── Sent Requests Tab
    │
    └── Main Content
        ├── Search Bar (for Find Friends & All Friends)
        │
        └── Tab Content
            ├── Find Friends
            │   └── User Cards (with Add Friend button)
            │
            ├── All Friends
            │   └── Friend Cards (with Message & Unfriend buttons)
            │
            ├── Requests
            │   └── Request Cards (with Accept & Decline buttons)
            │
            └── Sent Requests
                └── Sent Request Cards (with Cancel button)
```

## State Management Flow

### Sending Friend Request
```
User Action → sendFriendRequest()
    ↓
    POST /api/invitations/send
    ↓
    Backend: Create INVITED relationship (status: pending)
    ↓
    Response: Success
    ↓
    Frontend: Remove from suggestions, update stats
```

### Accepting Friend Request
```
User Action → acceptFriendRequest()
    ↓
    POST /api/invitations/{sender_uid}/accept
    ↓
    Backend: 
      1. Update INVITED status to "accepted"
      2. Create FRIENDS relationship (bidirectional)
    ↓
    Response: Success
    ↓
    Frontend: Remove from requests, update stats, refresh friends list
```

## Security

- **Authentication**: JWT Bearer tokens
- **Authorization**: Users can only:
  - View their own friends
  - Send requests to non-friends
  - Accept/decline requests sent to them
  - Cancel requests they sent
  - Remove their own friends

## Performance Optimizations

1. **Lazy Loading**: Fetch data only when tabs are active
2. **Debouncing**: Search input debounced
3. **Optimistic Updates**: Remove items immediately after actions
4. **Pagination**: Limit results to prevent large payloads
5. **Caching**: React Query can be added for better caching

## Future Enhancements

- [ ] Real-time notifications via WebSocket
- [ ] Mutual friends display
- [ ] Smart friend suggestions algorithm
- [ ] Online/offline status indicators
- [ ] Friend activity feed
- [ ] Block/report users
- [ ] Friend lists/groups
- [ ] Privacy settings (who can send requests)
