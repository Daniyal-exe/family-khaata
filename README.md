# 🏠 Khaata — Family Expense Manager
## Complete Setup Guide (Step by Step)

---

## PART 1: Supabase Setup

### Step 1 — Create a Supabase Account
1. Go to **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or email

---

### Step 2 — Create a New Project
1. After login, click **"New Project"**
2. Fill in:
   - **Project Name**: `khaata` (or anything you like)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose the closest to Pakistan (e.g., Singapore)
3. Click **"Create new project"**
4. Wait 1-2 minutes for the project to be ready

---

### Step 3 — Run the Database Schema
1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase_schema.sql` from this project
4. Copy ALL the SQL code and paste it into the SQL Editor
5. Click **"Run"** (green button)
6. You should see "Success. No rows returned"

This creates:
- `homes` table (family workspaces)
- `users` table (family members)
- `expenses` table (all expenses)
- All Row Level Security policies
- Realtime enabled on expenses

---

### Step 4 — Get Your API Keys
1. In Supabase, click **"Settings"** (gear icon) in the sidebar
2. Click **"API"**
3. You will see two important values:
   - **Project URL** → looks like `https://xyzabc.supabase.co`
   - **anon public** key → a long string starting with `eyJ...`
4. Copy both of these

---

### Step 5 — Add Keys to the Project
1. Open the file `js/config.js` in your code editor
2. Find these two lines at the top:
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://xyzabc.supabase.co';        // your URL
   const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cC...'; // your key
   ```
4. Save the file

---

### Step 6 — Configure Email Confirmation (Optional but Recommended)
By default Supabase sends a confirmation email before login works.

**Option A — Disable confirmation (easier for testing):**
1. Go to Supabase → **Authentication** → **Providers** → **Email**
2. Turn OFF **"Confirm email"**
3. Save

**Option B — Keep confirmation enabled:**
- Users will get an email after signup and must click the link before logging in
- Make sure your Supabase project has proper email settings

---

## PART 2: Running the App Locally

### Step 7 — Open the App
Since this is pure HTML/CSS/JS (no build tools needed), you have two options:

**Option A — Using VS Code Live Server (Recommended):**
1. Install VS Code from https://code.visualstudio.com
2. Install the **Live Server** extension (by Ritwick Dey)
3. Open the `khaata` project folder in VS Code
4. Right-click `index.html` → **"Open with Live Server"**
5. App opens at `http://127.0.0.1:5500`

**Option B — Using Python (if installed):**
```bash
cd khaata
python -m http.server 8000
```
Then open `http://localhost:8000`

**Option C — Just double-click index.html:**
This may work but some browsers restrict features for local files.

---

## PART 3: Deploying Online (Free)

### Step 8 — Deploy on Netlify (Free)
1. Go to **https://netlify.com** and sign up
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your entire `khaata` folder
4. Netlify gives you a free URL like `https://khaata-abc123.netlify.app`
5. Done! Share this URL with family members

**OR using GitHub:**
1. Push your code to a GitHub repository
2. In Netlify: Add new site → Import from Git → Connect GitHub
3. Select your repo → Deploy
4. Auto-deploys when you push changes

---

### Step 9 — Deploy on Vercel (Alternative)
1. Go to **https://vercel.com** and sign up
2. Install Vercel CLI: `npm i -g vercel`
3. In your project folder, run: `vercel`
4. Follow the prompts
5. Done!

---

## PART 4: Using the App

### Step 10 — First Time Setup
1. Open the app and click **"Sign Up"**
2. Enter your name, email, and password
3. If email confirmation is ON, check your email and confirm
4. Login with your credentials
5. You'll be taken to the **Workspace Setup** page
6. Choose **"Create New Home"** and enter your family name
7. A join code is generated (e.g., `AB3X7K`)
8. Share this code with family members

### Step 11 — Family Members Joining
1. Other family members open the app and sign up
2. On the Workspace Setup page, click **"Join with Code"**
3. Enter the 6-character code you shared
4. They're now part of the same family workspace!

---

## Project Folder Structure

```
khaata/
│
├── index.html          ← Login / Signup page
├── workspace.html      ← Create or join a family home
├── dashboard.html      ← Main dashboard with stats & charts
├── expenses.html       ← All expenses with filters & search
├── reports.html        ← Monthly reports with PDF/CSV download
├── supabase_schema.sql ← Database setup (run in Supabase)
│
├── css/
│   └── style.css       ← All styles (dark/light mode, responsive)
│
└── js/
    ├── config.js       ← Supabase keys + helper functions
    ├── theme.js        ← Dark/light mode toggle
    ├── toast.js        ← Toast notification system
    ├── auth.js         ← Login, signup, logout
    ├── home.js         ← Create/join workspace, join code
    ├── expenses.js     ← Add, edit, delete, fetch expenses
    └── reports.js      ← PDF and CSV report generation
```

---

## Features Checklist

✅ User Signup & Login  
✅ Session persistence (stays logged in)  
✅ Create family workspace  
✅ Join workspace with code  
✅ Add / Edit / Delete expenses  
✅ 9 predefined Urdu-friendly categories (Nashta, Milk, Petrol, etc.)  
✅ Dashboard with monthly & yearly stats  
✅ Category donut chart  
✅ Monthly trend bar chart  
✅ Realtime updates (expense appears instantly for all family members)  
✅ Search by item name  
✅ Filter by category, month  
✅ Monthly reports  
✅ Download as CSV  
✅ Download as PDF (print-ready)  
✅ Dark / Light mode with saved preference  
✅ Fully responsive (mobile, tablet, desktop)  
✅ Toast notifications  
✅ Delete confirmation dialog  
✅ Empty state UI  
✅ Row Level Security (users see only their family's data)  

---

## Common Problems & Solutions

**"Invalid API key" error:**  
→ Double-check you pasted the correct URL and anon key in `js/config.js`

**"Email not confirmed" error on login:**  
→ Either confirm via email, OR disable email confirmation in Supabase Auth settings

**Data not showing up:**  
→ Make sure the SQL schema was run successfully in Supabase SQL Editor

**Realtime not working:**  
→ Make sure you ran `ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;` from the schema file

**CORS error when opening locally:**  
→ Use VS Code Live Server or Python HTTP server instead of opening the HTML file directly

---

## Need Help?
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
