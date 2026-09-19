# 📸 RAMAYAML YOUTH Vissannapeta - Google Drive Photo Uploader

A modern, responsive full-stack web application for **RAMAYAML YOUTH Vissannapeta** that allows users to upload photos directly from mobile devices or desktop computers to a designated Google Drive account.

---

## 🚀 Key Features

- **Branded Header**: `RAMAYAML YOUTH Vissannapeta.` header with vibrant glassmorphism design.
- **Direct Google Drive Integration**: Photos upload straight to your Google Drive destination folder using official Google Drive API v3.
- **Drag-and-Drop & Multi-Select**: Drag and drop photos or select multiple images (JPG, JPEG, PNG, WEBP).
- **Live Preview & Queue Management**: Image thumbnails, file format tags, size indicators, and individual file removal buttons.
- **Real-Time Progress Tracking**: Overall and file transfer progress indicators powered by SSL streaming.
- **Success Celebration**: Displays exact success message (`Your photos have been uploaded successfully to Ramayaml Youth Google Drive!`) with confetti animation and direct links to view uploaded photos on Google Drive.
- **Retry Mechanism**: Instant error reporting with clear retry capabilities for failed uploads.
- **Mobile First & Responsive**: Optimized for phones, tablets, and desktop displays.
- **Security & Privacy**: Server-side file validation (max 15MB/file), rate limiting, CORS control, and zero credential exposure on client frontend.

---

## 📁 Project Structure

```
google-drive-photo-uploader/
├── frontend/                     # React + TypeScript + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Header, Dropzone, FilePreviewGrid, ProgressBar, SuccessCard, ErrorBanner, Footer
│   │   ├── services/             # Axios API client & health check
│   │   ├── types/                # TypeScript interfaces
│   │   ├── App.tsx               # Main layout & state orchestrator
│   │   ├── main.tsx              # React entrypoint
│   │   └── index.css             # Tailwind CSS & custom animations
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/                      # Node.js + Express + TypeScript Backend
│   ├── src/
│   │   ├── config/               # Google Auth & environment loader
│   │   ├── controllers/          # Photo upload, status & health controllers
│   │   ├── middleware/           # Multer file validation (15MB limit) & error handling
│   │   ├── routes/               # Express API endpoints (/api/photos/upload, /api/health)
│   │   ├── services/             # Google Drive API upload streaming
│   │   └── server.ts             # Express server setup & port listener
│   ├── .env                      # Backend local environment configuration
│   ├── package.json
│   └── tsconfig.json
├── .env.example                  # Environment variable blueprint
└── README.md                     # Comprehensive Setup & Guide
```

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Axios, Vite.
- **Backend**: Node.js, Express.js, TypeScript, Google Drive API (`googleapis`), Multer, CORS, Express Rate Limit, dotenv.

---

## 🔑 1. How to Set Up Google Cloud & Obtain Credentials

You can authorize photo uploads to your Google Drive using **Option A (Google OAuth 2.0 - Recommended)** or **Option B (Google Service Account)**.

### Step 1: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Select a Project** > **New Project**.
3. Name your project (e.g., `Ramayaml-Youth-Photo-Uploader`) and click **Create**.

### Step 2: Enable Google Drive API
1. In Google Cloud Console, navigate to **APIs & Services > Library**.
2. Search for **Google Drive API**.
3. Click **Enable**.

---

### Option A: Setup OAuth 2.0 Refresh Token (Recommended for Personal Google Drive)

1. Go to **APIs & Services > OAuth consent screen**.
2. Select **External** (or Internal for Workspace) and click **Create**.
3. Fill in App Name (`Ramayaml Youth Upload`), User Support Email, and Developer Email. Click **Save and Continue**.
4. Under **Scopes**, add `.../auth/drive.file` scope.
5. Under **Test Users**, add your personal Google email address.
6. Go to **APIs & Services > Credentials**.
7. Click **Create Credentials > OAuth client ID**.
8. Application type: **Web application**.
9. Authorized Redirect URIs: Add `https://developers.google.com/oauthplayground`
10. Click **Create** and copy your **Client ID** and **Client Secret**.

#### Obtain Your Refresh Token via OAuth Playground:
1. Open [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground).
2. Click the gear icon (⚙️) in the upper right:
   - Check **Use your own OAuth credentials**.
   - Paste your **OAuth Client ID** and **OAuth Client Secret**.
3. In the left panel, scroll to **Drive API v3** and select `https://www.googleapis.com/auth/drive.file`.
4. Click **Authorize APIs** and log in with your Google account.
5. Click **Exchange authorization code for tokens**.
6. Copy the generated **Refresh token**.

---

### Option B: Setup Google Service Account (Alternative)

1. Go to **APIs & Services > Credentials**.
2. Click **Create Credentials > Service Account**.
3. Name it `ramayaml-youth-uploader` and click **Create and Continue**.
4. Go to the **Keys** tab > **Add Key > Create new key** > Select **JSON**.
5. Save the downloaded JSON key file.
6. Open your Google Drive folder, click **Share**, and share the folder with your Service Account Email (`ramayaml-youth-uploader@...iam.gserviceaccount.com`) giving it **Editor** permissions.

---

## 📂 2. How to Obtain Destination `GOOGLE_DRIVE_FOLDER_ID`

1. Open [Google Drive](https://drive.google.com/) in your browser.
2. Create or navigate to the folder where uploaded photos should be stored (e.g., `Ramayaml Youth Photos 2026`).
3. Look at the URL in your browser address bar:
   `https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j_example_folder_id`
4. Copy the long string of characters after `/folders/`. This is your `GOOGLE_DRIVE_FOLDER_ID`.

---

## ⚡ 3. Environment Variables Configuration

Copy `.env.example` to `backend/.env`:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Destination Google Drive Folder ID
GOOGLE_DRIVE_FOLDER_ID=your_destination_folder_id_here

# Option A: OAuth 2.0 Credentials (Recommended)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REFRESH_TOKEN=your_oauth_refresh_token
GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground

# Option B: Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

---

## 💻 4. Local Development Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Install Backend Dependencies & Start Server
```bash
cd backend
npm install
npm run dev
```
The backend API will start on `http://localhost:5000`.

### Step 2: Install Frontend Dependencies & Start App
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 🧪 5. Testing the Upload Process

1. Open `http://localhost:5173` in your browser.
2. You will see:
   - Header: **RAMAYAML YOUTH Vissannapeta.**
   - Main Heading: **Upload Your Photos**
   - Description: *Share your memorable moments with Ramayaml Youth. Select your photos and upload them securely to our Google Drive.*
3. Drag & drop or select photos (JPG, PNG, WEBP).
4. Inspect thumbnails, format tags, file size, and remove individual photos if desired.
5. Click **Upload Photos**.
6. Observe the progress bar and real-time upload progress.
7. Upon completion, confetti will trigger and display the success message:
   `Your photos have been uploaded successfully to Ramayaml Youth Google Drive!`

---

## 🔒 6. Security & Error Handling

- **Zero Secret Exposure**: Google OAuth client secrets and refresh tokens are stored strictly in the backend `.env` file and never exposed to the frontend.
- **Server-Side Validation**: Backend validates file extension MIME types (`image/jpeg`, `image/jpg`, `image/png`, `image/webp`) and enforces a 15MB file size limit.
- **Rate Limiting**: Protects backend endpoints against brute-force/spam requests (100 requests / 15 minutes limit per IP).
- **Stream Uploads**: Photos stream directly from memory buffer to Google Drive without leaving lingering files on local server disk.

---

## 🚢 7. Production Deployment Guidelines

### Deploying Backend (Render / Railway / Heroku / AWS)
1. Build backend TypeScript code:
   ```bash
   cd backend && npm run build
   ```
2. Deploy the build directory `dist/` with start command `node dist/server.js`.
3. Set Environment Variables in your hosting dashboard (`GOOGLE_DRIVE_FOLDER_ID`, `GOOGLE_CLIENT_ID`, etc.).

### Deploying Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set Environment Variable `VITE_API_URL` to your live backend domain (e.g. `https://your-backend.onrender.com/api`).
2. Build command: `npm run build` inside `frontend/`.
3. Publish output directory: `frontend/dist`.

---

## 📜 License & Copyright

© 2026 **Ramayaml Youth**. All rights reserved.
Developed for Ramayaml Youth Vissannapeta community.
