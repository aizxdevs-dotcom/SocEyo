# Feed Components

This directory contains components used in the feed and friends features.

## Available Components

### FriendRequests.tsx
Displays pending friend requests in a widget format.

**Usage:**
```tsx
import FriendRequests from "@/components/Feed/FriendRequests";

<FriendRequests />
```

**Features:**
- Shows up to 3 pending requests
- Accept/decline buttons
- Auto-hides when no requests
- Links to full friends page
- Shows request count badge

---

### FriendSuggestions.tsx
Displays suggested users to add as friends.

**Usage:**
```tsx
import FriendSuggestions from "@/components/Feed/FriendSuggestions";

<FriendSuggestions limit={5} />
```

**Props:**
- `limit?: number` - Max number of suggestions to show (default: 5)

**Features:**
- Filters out existing friends
- One-click add friend
- Links to full friends page
- Auto-hides when no suggestions

---

### Example: Adding to Feed Page

```tsx
// app/feed/page.tsx
import FriendRequests from "@/components/Feed/FriendRequests";
import FriendSuggestions from "@/components/Feed/FriendSuggestions";

export default function FeedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <CreatePostForm onSuccess={handlePostSuccess} />
            {/* Posts list */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 sticky top-6">
            <FriendRequests />
            <FriendSuggestions limit={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

This creates a Facebook-style layout with feed on the left and friend widgets on the right.
