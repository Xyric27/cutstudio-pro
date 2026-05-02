# CutStudio Pro — Setup Guide

## 1. Firebase Firestore Setup (Real Database)

### Step 1 — Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"** → name it `cutstudio-pro`
3. Disable Google Analytics (optional) → **Create project**

### Step 2 — Enable Firestore
1. In Firebase Console → **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for now) → pick your region → **Enable**

### Step 3 — Get Your Config Keys
1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **"</>" (Web)**
3. Register app as `cutstudio-web`
4. Copy the config — you need:
   - `apiKey`
   - `projectId`

### Step 4 — Set Firestore Security Rules (important before going live!)
Go to **Firestore → Rules** and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Replace with auth rules in production
    }
  }
}
```

### Step 5 — Connect in the App
1. Open the app → Login page → Enable **Production Mode**
2. Enter your `Firebase API Key` and `Firebase Project ID`
3. The app will auto-connect and sync all data to Firestore in real-time ✓

---

## 2. Razorpay Payment Gateway Setup

### Step 1 — Create Razorpay Account
1. Go to https://razorpay.com/
2. Sign up and complete KYC (your business/freelancer details)
3. Activate your account

### Step 2 — Get API Keys
1. Razorpay Dashboard → **Settings → API Keys**
2. Click **"Generate Test Key"** (for testing) or **"Generate Live Key"** (for real payments)
3. Copy the **Key ID** (starts with `rzp_test_` or `rzp_live_`)

### Step 3 — Connect in the App
1. Login page → Enable **Production Mode**
2. Enter your Razorpay Key in the **Razorpay Key** field
3. Payment modal will now open real Razorpay checkout ✓

---

## 3. GitHub Hosting (GitHub Pages)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/cutstudio-pro.git
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repo → **Settings → Pages**
2. Source: **"GitHub Actions"**

### Step 3 — Set BASE_PATH Variable
1. Repo **Settings → Variables → Actions**
2. Add a new variable:
   - Name: `GITHUB_PAGES_BASE_PATH`
   - Value: `/cutstudio-pro/` (use your repo name)

### Step 4 — Add Secrets (optional — for production Firebase/Razorpay in CI)
1. Repo **Settings → Secrets → Actions**
2. Add:
   - `VITE_FIREBASE_API_KEY` — your Firebase API key
   - `VITE_FIREBASE_PROJECT_ID` — your Firebase project ID
   - `VITE_RAZORPAY_KEY` — your Razorpay key

### Step 5 — Deploy
Push any change to `main` branch — the GitHub Actions workflow will automatically build and deploy to:
`https://YOUR_USERNAME.github.io/cutstudio-pro/`

---

## 4. Better Option — Deploy on Replit (One Click)

Replit has built-in deployment — no GitHub setup needed:
1. Click the **"Deploy"** button in Replit
2. Your app gets a live `*.replit.app` URL instantly
3. Supports custom domains too

---

## Quick Checklist

| Step | Action | Status |
|------|--------|--------|
| Firebase project created | console.firebase.google.com | ☐ |
| Firestore enabled | Build → Firestore | ☐ |
| API Key copied | Project Settings → General | ☐ |
| Razorpay account active | razorpay.com | ☐ |
| Razorpay Key ID copied | Settings → API Keys | ☐ |
| App in Production Mode | Login → toggle | ☐ |
| GitHub repo created | github.com/new | ☐ |
| Pages enabled | Repo Settings → Pages | ☐ |
