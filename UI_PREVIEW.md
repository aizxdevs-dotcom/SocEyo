# 🎨 Friends System UI Preview

## Page Layouts

### Friends Page - Desktop View
```
┌────────────────────────────────────────────────────────────────┐
│ Navbar: [Soceyo] Feed Profile Friends Messages Notifications   │
└────────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────────┐
│                          Friends                                │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│ │ 👥 Friends   │ │ ✓ Requests   │ │ ⏰ Sent      │            │
│ │     15       │ │      3       │ │      2       │            │
│ └──────────────┘ └──────────────┘ └──────────────┘            │
└────────────────────────────────────────────────────────────────┘
┌─────────────┬──────────────────────────────────────────────────┐
│ SIDEBAR     │ MAIN CONTENT                                     │
│             │                                                  │
│ [🔍] Find   │ ┌─────────────────────────────────────────┐    │
│    Friends  │ │ Search: [Search for people...    ] [Go] │    │
│             │ └─────────────────────────────────────────┘    │
│ [👥] All    │                                                  │
│    Friends  │ ┌────────────┐ ┌────────────┐                   │
│             │ │ 👤 John    │ │ 👤 Jane    │                   │
│ [✓] Requests│ │ @john123   │ │ @jane_doe  │                   │
│      (3)    │ │            │ │            │                   │
│             │ │ [Add] [💬] │ │ [Add] [💬] │                   │
│ [⏰] Sent   │ └────────────┘ └────────────┘                   │
│    Requests │                                                  │
│      (2)    │ ┌────────────┐ ┌────────────┐                   │
│             │ │ 👤 Mike    │ │ 👤 Sarah   │                   │
│             │ │ @mike_m    │ │ @sarah_k   │                   │
│             │ │            │ │            │                   │
│             │ │ [Add] [💬] │ │ [Add] [💬] │                   │
│             │ └────────────┘ └────────────┘                   │
└─────────────┴──────────────────────────────────────────────────┘
```

### Friends Page - Mobile View
```
┌──────────────────────┐
│ ☰  Soceyo           │
└──────────────────────┘
┌──────────────────────┐
│      Friends         │
│ ┌──────────────────┐ │
│ │ 👥 Friends: 15   │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ✓ Requests: 3    │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ ⏰ Sent: 2       │ │
│ └──────────────────┘ │
└──────────────────────┘
┌──────────────────────┐
│ [🔍] Find Friends    │
│ [👥] All Friends     │
│ [✓] Requests (3)     │
│ [⏰] Sent (2)        │
└──────────────────────┘
┌──────────────────────┐
│ Search:              │
│ [____________] [Go]  │
└──────────────────────┘
┌──────────────────────┐
│ 👤 John Smith        │
│ @john123             │
│ [Add Friend] [💬]    │
└──────────────────────┘
┌──────────────────────┐
│ 👤 Jane Doe          │
│ @jane_doe            │
│ [Add Friend] [💬]    │
└──────────────────────┘
```

## Tab Views

### Find Friends Tab
```
┌────────────────────────────────────────┐
│ Search: [john____________] [Search]    │
└────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ 👤 JD           │  │ 👤 JW           │
│ John Doe        │  │ Johnny Walker   │
│ @john_doe       │  │ @johnny_w       │
│                 │  │                 │
│ Software Dev... │  │ Photographer    │
│                 │  │                 │
│ [➕ Add] [💬]   │  │ [➕ Add] [💬]   │
└─────────────────┘  └─────────────────┘
```

### All Friends Tab
```
┌────────────────────────────────────────┐
│ Search: [____________] [Search]        │
└────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐
│ 👤 JS           │  │ 👤 EK           │
│ John Smith      │  │ Emily Kim       │
│ @johnsmith      │  │ @emily_kim      │
│                 │  │                 │
│ Friends since   │  │ Friends since   │
│ Jan 2025        │  │ Feb 2025        │
│                 │  │                 │
│ [💬 Message]    │  │ [💬 Message]    │
│ [❌ Unfriend]   │  │ [❌ Unfriend]   │
└─────────────────┘  └─────────────────┘
```

### Requests Tab
```
┌────────────────────────────────────────┐
│ Friend Requests (3)                    │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 👤 Sarah Connor                        │
│ @sarah_c                               │
│                                        │
│ "Hey! Let's connect!"                  │
│ Sent 2 hours ago                       │
│                                        │
│ [✓ Accept] [✗ Decline]                │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 👤 Mike Ross                           │
│ @mike_ross                             │
│                                        │
│ Sent 1 day ago                         │
│                                        │
│ [✓ Accept] [✗ Decline]                │
└────────────────────────────────────────┘
```

### Sent Requests Tab
```
┌────────────────────────────────────────┐
│ Sent Requests (2)                      │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 👤 Rachel Green                        │
│ @rachel_g                              │
│                                        │
│ Status: Pending                        │
│ Sent 3 hours ago                       │
│                                        │
│ [✗ Cancel Request]                     │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 👤 Ross Geller                         │
│ @ross_g                                │
│                                        │
│ Status: Pending                        │
│ Sent 1 day ago                         │
│                                        │
│ [✗ Cancel Request]                     │
└────────────────────────────────────────┘
```

## Feed Widgets

### Friend Requests Widget
```
┌────────────────────────────────┐
│ ✓ Friend Requests (3) [See All]│
├────────────────────────────────┤
│ 👤 Sarah  "Let's connect!"     │
│    [✓ Accept] [✗ Decline]      │
├────────────────────────────────┤
│ 👤 Mike   "Hi!"                │
│    [✓ Accept] [✗ Decline]      │
├────────────────────────────────┤
│ 👤 Emily  "Hey there"          │
│    [✓ Accept] [✗ Decline]      │
├────────────────────────────────┤
│ [View All Requests]            │
└────────────────────────────────┘
```

### Friend Suggestions Widget
```
┌────────────────────────────────┐
│ 👥 People You May Know [See All]│
├────────────────────────────────┤
│ 👤 John  @john123    [➕]      │
│ 👤 Jane  @jane_doe   [➕]      │
│ 👤 Mike  @mike_m     [➕]      │
│ 👤 Sarah @sarah_k    [➕]      │
│ 👤 Emily @emily_kim  [➕]      │
├────────────────────────────────┤
│ [Find More Friends]            │
└────────────────────────────────┘
```

## Notification Toasts

### Success Messages
```
┌────────────────────────────────┐
│ ✓ Friend request sent!         │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Friend request accepted!     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Friend request declined      │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Friend request cancelled     │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✓ Friend removed               │
└────────────────────────────────┘
```

### Error Messages
```
┌────────────────────────────────┐
│ ✗ Cannot send request to self  │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✗ Already friends with user    │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ✗ Friend request already sent  │
└────────────────────────────────┘
```

## Loading States

### Page Loading
```
┌────────────────────────────────┐
│                                │
│         ⚙️ Loading...          │
│                                │
└────────────────────────────────┘
```

### Button Loading
```
[⚙️ Processing...] [⚙️]
```

### Empty States
```
┌────────────────────────────────┐
│         🔍                     │
│                                │
│  Search for people to add      │
│  as friends                    │
│                                │
└────────────────────────────────┘

┌────────────────────────────────┐
│         👥                     │
│                                │
│  You don't have any            │
│  friends yet                   │
│                                │
└────────────────────────────────┘

┌────────────────────────────────┐
│         ✓                      │
│                                │
│  No pending friend requests    │
│                                │
└────────────────────────────────┘
```

## Color Scheme

```
Primary Blue:    #2563eb (rgb(37, 99, 235))
Secondary Gray:  #6b7280 (rgb(107, 114, 128))
Success Green:   #16a34a (rgb(22, 163, 74))
Warning Orange:  #ea580c (rgb(234, 88, 12))
Error Red:       #dc2626 (rgb(220, 38, 38))
Purple:          #9333ea (rgb(147, 51, 234))

Background:      #f9fafb (Gray-50)
Card White:      #ffffff
Border:          #e5e7eb (Gray-200)

Text Primary:    #111827 (Gray-900)
Text Secondary:  #6b7280 (Gray-500)
Text Tertiary:   #9ca3af (Gray-400)
```

## Icons Used

| Icon | Purpose | Color |
|------|---------|-------|
| 🔍 | Search, Find Friends | Gray |
| 👥 | All Friends, Suggestions | Blue |
| ✓ | Requests, Accept | Green |
| ⏰ | Sent Requests, Pending | Orange |
| ➕ | Add Friend | Blue |
| 💬 | Message | Indigo |
| ✗ | Decline, Cancel, Remove | Red |
| ⚙️ | Loading | Blue |

## Responsive Breakpoints

```
Mobile:   < 768px   (Single column)
Tablet:   768-1024px (Single column, larger cards)
Desktop:  > 1024px   (Sidebar + Content)
```

## Animation Details

- **Fade In**: 0.3s ease-in
- **Slide In**: 0.35s ease-out
- **Toast**: 3s duration
- **Button Hover**: 0.2s transition
- **Card Hover**: 0.2s shadow transition

---

This preview shows the Facebook-style design of your friends system! 🎨
