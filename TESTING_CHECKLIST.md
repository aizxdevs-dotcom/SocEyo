# Friends System Testing Checklist

## Prerequisites
- [ ] Backend running on `http://127.0.0.1:8000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] At least 2 user accounts created
- [ ] Browser DevTools open to monitor network requests

---

## Test Scenarios

### 1. Navigation & UI
- [ ] Friends link visible in navbar (purple Users icon)
- [ ] Clicking Friends link navigates to `/friends`
- [ ] Page loads without errors
- [ ] All 4 tabs are visible: Find Friends, All Friends, Requests, Sent Requests
- [ ] Stats cards display correctly (Total Friends, Requests, Sent)
- [ ] Mobile responsive menu works
- [ ] Friends link accessible on mobile

### 2. Find Friends Tab
- [ ] Tab is active by default on first visit
- [ ] Search input is visible and functional
- [ ] Placeholder text: "Search for people..."
- [ ] Search button is clickable
- [ ] Entering < 2 characters shows appropriate message
- [ ] Searching with 2+ characters shows results
- [ ] User cards display:
  - [ ] Avatar (with initials fallback)
  - [ ] Username
  - [ ] Full name (if available)
  - [ ] Bio (if available)
- [ ] "Add Friend" button visible on each user card
- [ ] Message icon button visible on each user card
- [ ] No duplicate users in results
- [ ] Current user is excluded from results
- [ ] Existing friends are excluded from results

### 3. Sending Friend Requests
- [ ] Click "Add Friend" button
- [ ] Loading spinner appears on button
- [ ] Success notification toast appears
- [ ] User is removed from suggestions
- [ ] Stats update (Pending Sent count increases)
- [ ] Request appears in "Sent Requests" tab
- [ ] Can't send duplicate requests
- [ ] Error message shows if request fails

### 4. All Friends Tab
- [ ] Tab switches correctly
- [ ] Shows "No friends" message when empty
- [ ] Search input works for filtering friends
- [ ] Friend cards display:
  - [ ] Avatar
  - [ ] Username/Full name
  - [ ] Friendship date
- [ ] "Message" button functional
- [ ] "Unfriend" button visible
- [ ] Clicking Message redirects to `/messages?userId={id}`

### 5. Removing Friends
- [ ] Click unfriend button (trash icon)
- [ ] Confirmation dialog appears
- [ ] Canceling keeps friend
- [ ] Confirming removes friend
- [ ] Success notification appears
- [ ] Friend removed from list
- [ ] Stats update (Total Friends decreases)

### 6. Friend Requests Tab
- [ ] Tab switches correctly
- [ ] Shows "No pending requests" when empty
- [ ] Request cards display:
  - [ ] Sender avatar
  - [ ] Sender username
  - [ ] Optional message
  - [ ] Request date/time
- [ ] "Accept" button (with checkmark)
- [ ] "Decline" button (with X)

### 7. Accepting Friend Requests
**As User B (receiver):**
- [ ] Navigate to Requests tab
- [ ] See request from User A
- [ ] Click "Accept" button
- [ ] Loading spinner appears
- [ ] Success notification shows
- [ ] Request removed from list
- [ ] Stats update (Requests decreases, Total Friends increases)
- [ ] User A appears in "All Friends" tab
- [ ] Can now message User A

**As User A (sender):**
- [ ] Stats update automatically (or after page refresh)
- [ ] User B appears in "All Friends" tab
- [ ] Request removed from "Sent Requests"

### 8. Declining Friend Requests
- [ ] Click "Decline" button
- [ ] Loading spinner appears
- [ ] Success notification shows
- [ ] Request removed from list
- [ ] Stats update (Requests decreases)
- [ ] User doesn't appear in friends list

### 9. Sent Requests Tab
- [ ] Tab switches correctly
- [ ] Shows "No pending sent requests" when empty
- [ ] Sent request cards display:
  - [ ] Receiver avatar
  - [ ] Receiver username
  - [ ] "Pending" status
  - [ ] Sent date/time
- [ ] "Cancel Request" button visible

### 10. Canceling Sent Requests
- [ ] Click "Cancel Request" button
- [ ] Loading spinner appears
- [ ] Success notification shows
- [ ] Request removed from list
- [ ] Stats update (Pending Sent decreases)

### 11. Search Functionality
**In Find Friends tab:**
- [ ] Type partial username (e.g., "joh" for "john")
- [ ] Results update on search
- [ ] Case-insensitive search works
- [ ] Search by full name works
- [ ] Clear search shows message or empty state

**In All Friends tab:**
- [ ] Type friend's name
- [ ] List filters correctly
- [ ] No results message when no match
- [ ] Clear search shows all friends again

### 12. Statistics
- [ ] Total Friends count is accurate
- [ ] Pending Received count is accurate
- [ ] Pending Sent count is accurate
- [ ] Stats update after:
  - [ ] Accepting request
  - [ ] Declining request
  - [ ] Sending request
  - [ ] Canceling request
  - [ ] Removing friend

### 13. Error Handling
- [ ] Invalid user ID shows error
- [ ] Network error shows notification
- [ ] Backend down shows error message
- [ ] Duplicate request attempt shows error
- [ ] Can't send request to self
- [ ] Can't send request to existing friend

### 14. Loading States
- [ ] Initial page load shows spinner
- [ ] Tab switching shows loading
- [ ] Action buttons show loading during API calls
- [ ] Search shows loading during fetch
- [ ] No race conditions (multiple clicks)

### 15. Responsive Design
**Desktop (> 1024px):**
- [ ] Sidebar navigation on left
- [ ] Main content on right (3/4 width)
- [ ] 2-column grid for user/friend cards
- [ ] All stats visible in one row

**Tablet (768px - 1024px):**
- [ ] Sidebar stacks above content
- [ ] Cards adjust to single column
- [ ] Touch-friendly button sizes

**Mobile (< 768px):**
- [ ] Full-width layout
- [ ] Single column cards
- [ ] Mobile navigation in navbar
- [ ] Friends link in mobile menu
- [ ] Stats stack vertically

### 16. Feed Widgets (Optional)
**If you added FriendRequests & FriendSuggestions:**
- [ ] Widgets appear in feed sidebar
- [ ] FriendRequests shows up to 3 requests
- [ ] Badge shows total request count
- [ ] "See All" link goes to /friends?tab=requests
- [ ] Accept/Decline work from widget
- [ ] FriendSuggestions shows 5 suggestions
- [ ] "Add Friend" works from widget
- [ ] "Find More Friends" goes to /friends
- [ ] Widgets hide when no data

### 17. Integration with Messages
- [ ] Click Message button on friend card
- [ ] Redirects to messages page
- [ ] Opens conversation with selected friend
- [ ] User ID passed correctly in URL

### 18. Data Persistence
- [ ] Refresh page maintains state
- [ ] Tab selection resets on page reload
- [ ] Stats persist after actions
- [ ] Friends list persists
- [ ] Logout clears authentication

### 19. Edge Cases
- [ ] Empty search query handling
- [ ] Very long usernames/bios truncate
- [ ] Missing profile photos show initials
- [ ] Special characters in names display correctly
- [ ] Multiple simultaneous requests handled
- [ ] Race conditions prevented

### 20. Accessibility
- [ ] Keyboard navigation works
- [ ] Tab key moves focus logically
- [ ] Enter key submits search
- [ ] Buttons have hover states
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader friendly (aria labels)

---

## Performance Checks
- [ ] Page loads in < 2 seconds
- [ ] Search results appear in < 500ms
- [ ] No console errors
- [ ] No console warnings
- [ ] Network requests are optimized
- [ ] No unnecessary re-renders

## Security Checks
- [ ] JWT token sent with requests
- [ ] 401 errors redirect to login
- [ ] Can't access other users' data
- [ ] CORS configured correctly
- [ ] Sensitive data not logged

---

## Bug Report Template

If you find issues, use this template:

```
**Bug Title**: [Brief description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected Behavior**: 

**Actual Behavior**: 

**Screenshots**: [If applicable]

**Environment**:
- Browser: 
- OS: 
- Screen size: 

**Console Errors**: [Copy any errors]

**Network Tab**: [Copy failed requests]
```

---

## Test Results Summary

| Feature Area          | Status | Notes |
|-----------------------|--------|-------|
| Navigation            | ⬜     |       |
| Find Friends          | ⬜     |       |
| Send Requests         | ⬜     |       |
| All Friends           | ⬜     |       |
| Remove Friends        | ⬜     |       |
| Requests              | ⬜     |       |
| Accept Requests       | ⬜     |       |
| Decline Requests      | ⬜     |       |
| Sent Requests         | ⬜     |       |
| Cancel Requests       | ⬜     |       |
| Search                | ⬜     |       |
| Statistics            | ⬜     |       |
| Error Handling        | ⬜     |       |
| Loading States        | ⬜     |       |
| Responsive Design     | ⬜     |       |
| Feed Widgets          | ⬜     |       |
| Messages Integration  | ⬜     |       |
| Data Persistence      | ⬜     |       |
| Edge Cases            | ⬜     |       |
| Accessibility         | ⬜     |       |

✅ = Pass | ⬜ = Not Tested | ❌ = Fail

---

**Test Date**: _______________  
**Tester**: _______________  
**Overall Status**: _______________
