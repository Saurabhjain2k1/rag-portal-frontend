# 🧠 Multi-Tenant RAG Portal – Frontend

### React + TypeScript + Material UI + JWT Auth + Multi-Tenant UI

This is the **frontend** for the Multi-Tenant RAG Portal.

It provides:

* Login & tenant-aware authentication
* Chat UI for querying your tenant’s knowledge
* Document upload & ingestion UI (files + URLs)
* User management (admin-only)
* Profile & password change
* Responsive layout with sidebar + AppBar
* Modern UI using **Material UI (MUI v5)**
* Secure API communication with JWT

Backend repo lives separately:
👉 **rag-portal-backend** (FastAPI, local embeddings, Chroma, PostgreSQL)

---

## 🚀 Tech Stack

| Layer      | Tech                        |
| ---------- | --------------------------- |
| Framework  | React 18 + Vite             |
| Language   | TypeScript                  |
| UI Library | Material UI (MUI v5)        |
| State      | React Context (AuthContext) |
| Router     | React Router v6             |
| API Client | Axios                       |
| Icons      | @mui/icons-material         |
| Build Tool | Vite                        |

---

## 📦 Folder Structure

```
rag-portal-frontend/
│
├── src/
│   ├── api/               # Axios API clients (auth, users, documents, chat)
│   ├── components/
│   │     └── Layout/      # AppLayout, Sidebar, Header, ProtectedRoute
│   ├── context/           # AuthContext (handles login, token, /auth/me)
│   ├── pages/
│   │     ├── LoginPage.tsx
│   │     ├── ChatPage.tsx
│   │     ├── DocumentsPage.tsx
│   │     ├── UsersPage.tsx
│   │     ├── ProfilePage.tsx
│   │     ├── RegisterTenantPage.tsx
│   ├── utils/             # Helpers (formatting, icons)
│   ├── App.tsx
│   ├── main.tsx
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000
```

In production (Vercel/Netlify/AWS Amplify), set the same env variable.

All Axios calls use:

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

---

## 🔐 Authentication Flow

The frontend uses:

* `/auth/login` → get JWT token
* store token in `localStorage`
* auto-fetch user via `/auth/me`
* protect all app routes using `<ProtectedRoute />`

Admin vs User features:

| Page                      | Admin | User |
| ------------------------- | ----- | ---- |
| Chat                      | ✅     | ✅    |
| Upload Files / URLs       | ✅     | ❌    |
| Ingest Documents          | ✅     | ❌    |
| Users Management          | ✅     | ❌    |
| Profile / Password Change | ✅     | ✅    |

---

## 🧱 Features

### ✔ Login & JWT Auth

* Modern login page
* Error handling
* Redirects to `/app/chat` after login

### ✔ Tenant Registration Page

Used for onboarding new tenant + admin:

```
Tenant Name
Admin Email
Admin Password
```

After registration → redirect to login.

### ✔ Chat Page

* Human + bot bubbles
* Press Enter to send
* Streams conversation in UI
* Calls backend `/chat/query`

---

### ✔ Documents Page

Admin-only.

Features:

* Upload file (PDF/TXT/MD/DOCX/CSV/JSON/HTML)
* Add URL as a document
* Show file-type icons
* Ingest button with loader
* Pagination
* Error handling for unsupported types

### ✔ Users Page

Admin-only.

Features:

* Search
* Pagination
* Create user
* Edit user

  * email
  * role
  * reset password
* Delete user

---

### ✔ Profile Page

* Show logged-in user's details
* Change password form
* Avatar menu (top-right) with:

  * Profile
  * Logout

---

## 🖥 Running Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start dev server

```bash
npm run dev
```

Frontend runs at:

> [http://localhost:5173](http://localhost:5173)

Make sure backend is running at:

> [http://localhost:8000](http://localhost:8000)

---

## 🛠 Production Build

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Deploy the `dist/` folder to:

* Vercel
* Netlify
* Cloudflare Pages
* AWS Amplify
* GitHub Pages (with SPA fallback)

---

## 🔌 API Clients

Located in `src/api/`.

Example (`documentsApi.ts`):

```ts
export async function fetchDocuments(): Promise<DocumentDTO[]> {
  return (await api.get("/documents")).data;
}
```

Example (`authApi.ts`):

```ts
export async function login(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}
```

---

## 🔒 Protected Routing

`ProtectedRoute.tsx` ensures:

* Token exists
* `/auth/me` is fetched
* Redirects to `/login` if unauthorized

---

## 🎨 UI/UX

Uses MUI for:

* AppBar + Sidebar layout
* Dark/light mode friendly
* Responsive drawer
* Icons for readability
* Chip-based statuses

Chat UI uses:

* Colored bubbles
* Scroll container
* Autoscroll on new message
* Enter-to-send

---

## 🤝 Backend Compatibility

This frontend is built for the **rag-portal-backend**:

* FastAPI
* Chroma vector DB
* HuggingFace embeddings
* JWT auth
* Multi-tenant architecture

---

## ⚠️ Known Improvements (Future Enhancements)

* Soft delete documents
* Re-ingest specific document
* Tenant-level dashboard (stats, ingestion counts)
* Chat conversation history
* Dark mode toggle
* Multi-tenant admin (superadmin)

---

## 📜 License

Choose your license (MIT recommended). Example:

```
MIT License  
Copyright (c) 2025 …
```

---

## 🙋‍♂️ Author

**Saurabh Jain**

* GitHub: https://github.com/Saurabhjain2k1

---