# RajkotLive — Hyperlocal Community Platform for Rajkot

A modern, frontend-only community platform built for Rajkot, Gujarat. Browse local events, food spots, sports updates, and cultural happenings — all on an interactive map.

## Tech Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS 3, shadcn/ui components
- **Maps:** Leaflet + react-leaflet v4 (OpenStreetMap tiles — no API key needed)
- **Forms:** React Hook Form + Yup validation
- **Icons:** Lucide React
- **State:** React Context (Auth)

## Features

- **Home Feed** — All posts with trending sidebar
- **Category Pages** — Events, Food, Sports, Dayro (culture)
- **Single Post Page** — Full content, comments, like/report/share, location card with distance, OG meta tags
- **Create Post** — Multi-step form (info → image → location with map picker → preview)
- **Explore Map** — Interactive map with all geotagged posts, category color filters, user location button
- **User Profile** — Posts by user, stats
- **Search** — Full-text search across posts
- **Auth** — Login / Register with form validation (mock auth with localStorage)
- **Notifications** — Dropdown with unread count and mark-as-read
- **Responsive** — Mobile-friendly with hamburger menu

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

## Project Structure

```
app/
├── page.tsx              # Home feed
├── layout.tsx            # Root layout (AuthProvider, Navbar, Leaflet CSS)
├── events/page.tsx       # Events category
├── food/page.tsx         # Food category
├── sports/page.tsx       # Sports category
├── dayro/page.tsx        # Dayro (culture) category
├── login/page.tsx        # Login page
├── register/page.tsx     # Register page
├── create/page.tsx       # Multi-step create post
├── explore/page.tsx      # Explore map page
├── search/page.tsx       # Search page
├── post/[id]/page.tsx    # Single post page
└── profile/[username]/page.tsx  # User profile

components/
├── Navbar.tsx            # Top navigation bar
├── PostCard.tsx          # Post preview card
├── PostFeed.tsx          # Post list with loading/empty states
├── TrendingSidebar.tsx   # Top 5 trending posts
├── NotificationDropdown.tsx # Notifications popover
├── MapPicker.tsx         # Interactive map for location selection
├── MapView.tsx           # Read-only map display
├── LocationCard.tsx      # Location info with map + directions
├── ExploreMapClient.tsx  # Full explore map with filters
└── ui/                   # shadcn/ui primitives

lib/
├── types.ts              # TypeScript interfaces
├── mock-data.ts          # 10 posts with real Rajkot coordinates, users, notifications
├── api.ts                # Fake async API (CRUD posts, auth, search, comments, likes, reports)
├── auth-context.tsx      # Auth React context
├── geo.ts                # Haversine distance + Rajkot center coords
└── utils.ts              # cn() utility
```

## Mock API Reference

| Function                                    | Description                                    |
| ------------------------------------------- | ---------------------------------------------- |
| `getPosts(category?)`                       | Get all posts, optionally filtered by category |
| `getPostById(id)`                           | Get single post by ID                          |
| `searchPosts(query)`                        | Full-text search on title + content            |
| `createPost(input)`                         | Create a new post                              |
| `toggleLike(postId)`                        | Toggle like on a post                          |
| `addComment(postId, text)`                  | Add comment to a post                          |
| `reportPost(postId)`                        | Flag a post as reported                        |
| `getNotifications()`                        | Get all notifications                          |
| `markNotificationsRead()`                   | Mark all notifications as read                 |
| `getTrendingPosts()`                        | Get top 5 posts by likes + views               |
| `login(email, password)`                    | Mock login (any email works)                   |
| `register(name, username, email, password)` | Mock register                                  |
| `logout()`                                  | Clear auth from localStorage                   |
| `getCurrentUser()`                          | Get current user from localStorage             |
| `getUserByUsername(username)`               | Get user by username                           |
| `getPostsByUser(username)`                  | Get posts by a specific user                   |

### Admin API

| Function                       | Description                                                           |
| ------------------------------ | --------------------------------------------------------------------- |
| `getAdminStats()`              | Dashboard stats (users, posts, comments, reports, category breakdown) |
| `getAllUsers()`                | Get all non-banned users                                              |
| `getAllUsersIncludingBanned()` | Get all users including banned                                        |
| `adminDeletePost(postId)`      | Permanently delete a post                                             |
| `adminDeleteUser(userId)`      | Delete a user and all their posts                                     |
| `adminBanUser(userId)`         | Ban a user                                                            |
| `adminUnbanUser(userId)`       | Unban a user                                                          |
| `getReportedPosts()`           | Get all posts flagged by users                                        |
| `adminDismissReport(postId)`   | Clear reports on a post                                               |

## Admin Panel

The admin panel is accessible at `/admin` when logged in as an admin user.

**Login:** `admin@rajkotlive.com` (any password)

### Admin Features

- **Dashboard** — Stats cards (users, posts, comments, reports), posts by category bar chart, recent activity timeline
- **Posts Management** — Search/filter all posts, filter by category or reported status, delete posts, view post links
- **Users Management** — Search users, ban/unban users, delete users (cascades to their posts)
- **Reports Moderation** — View all reported posts with report counts, dismiss false reports, delete violating posts

### Admin Routes

```
/admin              → Dashboard
/admin/posts        → Posts management
/admin/users        → Users management
/admin/reports      → Reported content moderation
```

## Mock Auth

For demo purposes, any email/password combination will work for login. Registration creates a temporary user. Auth state is persisted in `localStorage`.

**Demo accounts:**

- `demo@gmail.com` — Demo user (regular user)
- `admin@rajkotlive.in` — **Admin@123** (full admin panel access)

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
