<p align="center">
  <img src="./public/images/surakshaar-logo.png" alt="SurakshaAR Logo" width="380" />
</p>

<p align="center">
  <strong>Immersive Training for a Safer Bharat.</strong><br />
  <em>Smart India Hackathon 2026 · Problem Statement SIH26041</em><br />
  <strong>AR & 3D Vocational Safety Training Simulator for Industrial & Mining Workers</strong>
</p>

<p align="center">
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react&logoColor=black&style=for-the-badge" alt="React" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-5.4-646cff.svg?logo=vite&style=for-the-badge" alt="Vite" /></a>
  <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-WebGL-black.svg?logo=three.js&style=for-the-badge" alt="Three.js" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ecf8e.svg?logo=supabase&style=for-the-badge" alt="Supabase" /></a>
  <a href="#"><img src="https://img.shields.io/badge/SIH-2026-E05A00.svg?style=for-the-badge" alt="SIH 2026" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <a href="https://tusharambastha.github.io/SurakshaAR/"><img src="https://img.shields.io/badge/🚀_Live_Demo-Open_Platform-E05A00?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
  <a href="https://tusharambastha.github.io/SurakshaAR/#/scenario/a1b2c3d4-0001-0001-0001-000000000001"><img src="https://img.shields.io/badge/🔥_AR_Fire_Simulator-Launch_Module-EF4444?style=for-the-badge" alt="AR Fire Simulator" /></a>
  <a href="https://tusharambastha.github.io/SurakshaAR/#/dashboard"><img src="https://img.shields.io/badge/🎯_Trainee_Dashboard-Explore-10B981?style=for-the-badge" alt="Dashboard" /></a>
  <a href="https://tusharambastha.github.io/SurakshaAR/#/admin-login"><img src="https://img.shields.io/badge/🛡️_Admin_Portal-Login-6366F1?style=for-the-badge" alt="Admin Portal" /></a>
</p>

<br />

<p align="center">
  <img src="./public/images/surakshaar-hero-preview-v2.png" alt="SurakshaAR Platform Interface" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid #e5e7eb;" />
</p>

---

## 🌐 Live Deployment & Direct Links

| Module | URL | Direct Action |
|---|---|---|
| **Platform Homepage** | [https://tusharambastha.github.io/SurakshaAR/](https://tusharambastha.github.io/SurakshaAR/) | Landing page, feature overview, trilingual UI |
| **AR Fire Safety Simulator** | [Launch AR Fire Module](https://tusharambastha.github.io/SurakshaAR/#/scenario/a1b2c3d4-0001-0001-0001-000000000001) | Live camera AR fire hazard detection & response |
| **Trainee Dashboard** | [Open Trainee Dashboard](https://tusharambastha.github.io/SurakshaAR/#/dashboard) | 4 industry modules, progress KPIs, certificates |
| **Admin & Compliance Portal** | [Open Admin Portal](https://tusharambastha.github.io/SurakshaAR/#/admin-login) | Safety officer analytics, pass rates, audit logs |

#### 🔑 Zero-Setup Demo Credentials:
- **Trainee**: Automatic 1-Click login or `trainee@suraksha.demo`
- **Admin**: `admin@suraksha.demo` / `Admin@1234`


---

## 📌 Problem Context

Industrial workers and vocational trainees across Jharkhand’s mining, steel, and manufacturing sectors operate in hazardous high-risk environments. Traditional classroom training often fails to build real situational muscle memory, while hands-on emergency drills carry high logistical costs and genuine physical risks.

**SurakshaAR** bridges this critical gap by delivering mobile-first, immersive augmented reality safety simulations directly on standard Android smartphones without requiring expensive specialized headsets.

---

## 🌟 Live Experience & Highlights

- 📱 **Camera AR Mode**: Live camera passthrough with 3D hazard overlays and interactive emergency response sequences.
- 🕹️ **Interactive 3D Simulation**: Full 360° rotational simulation with OrbitControls, directional D-pad, and smooth camera target focusing.
- 🤖 **Aapka Apna Suraksha Saathi**: Dedicated floating safety chatbot with curated industrial regulations and instant voice text-to-speech.
- 🌐 **Trilingual by Design**: Complete accessibility in **English**, **Hindi (हिंदी)**, and **Santali (Ol Chiki ᱥᱟᱱᱛᱟᱲᱤ)**.
- 🔐 **Blockchain Integrity Certificates**: Cryptographic SHA-256 certificate hashing with instant public QR verification.
- 📶 **Offline-First Resilience**: Powered by IndexedDB for uninterrupted training in underground mines or zero-connectivity sites.

---

## ✨ Key Features Detailed

### 1. 📷 Camera AR & 3D Simulation
- **Dual-Mode Experience**:
  - **Camera AR Mode**: Overlays real-time 3D safety hazards, emergency exits, and interactive PPE stations onto the smartphone's live camera feed via `navigator.mediaDevices.getUserMedia` with gyro orientation tracking.
  - **3D Simulation Mode**: Full 3D environment with `OrbitControls` for desktop and non-camera devices.
- **Realistic Hazard Scenarios**:
  - **Fire & Explosion Response** (Manufacturing plant): Alarm activation, electrical fire response, fire-rated PPE station, CO₂ extinguisher selection, fire exits, and muster assembly.
  - **Gas Leak & Confined Space Protocol** (Mining tunnel): Gas detector warning, alarm activation, buddy system enforcement, SCBA breathing apparatus, and evacuation.
  - **Machinery Safety & LOTO** (Lockout/Tagout - upcoming module).

### 2. 🌐 Multilingual Accessibility
- **Trilingual Support**: English, Hindi (हिंदी), and Santali (Ol Chiki script ᱥᱟᱱᱛᱟᱲᱤ).
- **Text-to-Speech (TTS)**: Built-in voice engine for Hindi and Indian English to read out instructions, tutorials, and questions aloud for low-literacy workers.
- **High-Contrast Accessibility Mode**: Single-click toggle for high-visibility industrial lighting conditions.

### 3. 📝 Assessment & Immediate Feedback
- Pre-verified assessment questions per hazard scenario in English, Hindi, and Santali.
- Real-time scoring algorithm based on:
  - Base score: 100 points
  - Deduction: 10 points per missed or incorrect action
  - Time penalty: Scaled deduction if exceeding benchmark completion time
  - PPE bonus: +5 points for 100% correct PPE donning discipline
- Passing threshold: 60%.

### 4. 🔐 Cryptographic Certificates & QR Verification
- **Tamper-Proof Integrity**: Generates a canonical payload of certificate metadata hashed using SHA-256 via the browser-native `crypto.subtle.digest` API.
- **Embedded QR Code**: Each certificate contains a scannable QR code directing to `/verify/:certNumber`.
- **Public Verification Portal**: Accessible to safety inspectors without login; re-calculates the cryptographic hash against stored records to detect forgery or tampering.
- **Downloadable**: Generates high-resolution PNG certificates via `html-to-image`.

### 5. 📡 Offline-First Architecture
- Powered by **IndexedDB** (`idb` library).
- Allows trainees to complete modules in underground mines or low-connectivity zones.
- Training sessions and action logs are queued locally and automatically synchronized with the server when network connectivity is restored.

### 6. 🤖 Curated Safety Knowledge Assistant
- Non-hallucinatory, deterministic chatbot answering industrial safety queries.
- Keyword and context-matching against a curated repository of 40+ industrial safety regulations.
- Voice read-aloud support for responses.

### 7. 📊 Web Admin & Compliance Portal
- Role-gated dashboard for industrial safety officers.
- Real-time compliance tracking, site-by-site pass rates, and trainee performance metrics.
- Trainee directory with search, filtering, and detailed session history.
- Certificate registry with status auditing and revocation controls.

---

## 🏛️ Project Structure

```
SurakshaAR1/
├── dist/                      # Production build output
├── public/                    # PWA manifest, favicons, shield icon
├── supabase/
│   ├── schema.sql             # PostgreSQL schema with RLS policies & indexes
│   └── seed.sql               # Scenarios & multilingual question bank
├── src/
│   ├── components/
│   │   ├── auth/              # ProtectedRoute & AdminRoute guards
│   │   ├── chatbot/           # SafetyChatbot floating widget
│   │   ├── layout/            # Navbar with lang switcher, voice, contrast
│   │   └── ui/                # OfflineBanner, CompletionPopup
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Auth state with Supabase + mockDb fallback
│   │   ├── LanguageContext.jsx# i18n & font switcher (EN/HI/SAT)
│   │   ├── AccessibilityContext.jsx # High contrast toggle
│   │   └── OfflineContext.jsx # Connectivity & sync queue runner
│   ├── lib/
│   │   ├── blockchain.js      # SHA-256 canonical hashing & verification
│   │   ├── certificate.js     # Certificate issuance & queries
│   │   ├── i18n.js            # Translation strings (EN/HI/SAT)
│   │   ├── indexeddb.js       # Offline queue storage
│   │   ├── mockDb.js          # Out-of-the-box local storage database
│   │   ├── safetyKnowledge.js # Curated safety rules database
│   │   ├── scoring.js         # Benchmark & penalty scoring engine
│   │   ├── supabase.js        # Supabase client & error formatter
│   │   └── voice.js           # Web Speech API TTS & STT wrapper
│   ├── pages/
│   │   ├── admin/             # Admin, AdminTrainees, AdminTraineeDetail,
│   │   │                      # AdminCompliance, AdminCertificates
│   │   ├── Assessment.jsx     # Multilingual quiz engine
│   │   ├── Certificate.jsx    # Certificate viewer & downloader
│   │   ├── Dashboard.jsx      # Trainee hub & KPI overview
│   │   ├── Landing.jsx        # SIH public introduction page
│   │   ├── Login.jsx          # Trainee sign-in
│   │   ├── Profile.jsx        # Trainee settings & session records
│   │   ├── Results.jsx        # Score ring, breakdown, and feedback
│   │   ├── Scenario.jsx       # Camera AR + 3D Simulation Three.js scene
│   │   ├── Signup.jsx         # Trainee registration
│   │   ├── Tutorial.jsx       # 5-step pre-AR guide with voice
│   │   └── Verify.jsx         # Public QR certificate verification
│   ├── App.jsx                # React Router root & Error Boundary
│   ├── index.css              # Design system & CSS custom properties
│   └── main.jsx               # React DOM entrypoint
├── index.html                 # PWA HTML shell with font preloads
├── netlify.toml               # Netlify configuration & security headers
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation
```bash
# Clone or navigate to the project directory
cd /Users/kishananand/Desktop/SurakshaAR1

# Install dependencies (using legacy peer deps for three/fiber compatibility)
npm install --legacy-peer-deps
```

### Running Locally (Zero-Config Demo Mode)
The project includes a full **Mock Database fallback**. If Supabase keys are not present in `.env`, the application seamlessly runs in demo mode using `localStorage` and `IndexedDB`.

```bash
# Start Vite development server
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

#### Demo Credentials:
- **Trainee**: Register any email/password on `/signup` or sign in with any account.
- **Admin**: Log in at `/admin-login` with:
  - **Email:** `admin@suraksha.demo`
  - **Password:** `Admin@1234`

---

## 🔌 Connecting Real Supabase Backend (Optional)

1. Create a project on [supabase.com](https://supabase.com).
2. Run the SQL migrations:
   - Paste the contents of `supabase/schema.sql` into the **SQL Editor** in Supabase and run it.
   - Paste the contents of `supabase/seed.sql` to populate scenarios and assessment questions.
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_CHAIN_MODE=local
   ```

---

## 🤖 Suraksha Mitra — Real AI Safety Chatbot

SurakshaAR features **Suraksha Mitra**, a genuine conversational AI assistant tailored specifically for frontline mining and manufacturing workers across Jharkhand. Unlike canned chatbots, Suraksha Mitra connects to Google Gemini (`gemini-2.0-flash`) via an external serverless backend proxy with real-time token streaming, multi-turn conversation memory, and sliding-window rate limiting.

### 📐 Architecture & Security
```
[React App on GitHub Pages]
        │
        ▼ (POST /api/chat with { messages, sessionId, stream: true })
[Cloudflare Worker Backend Proxy]
        │
        ├── In-memory Sliding Window Rate Limiting (25 req/min per session)
        ├── CORS Origin Authorization
        ├── Reads GEMINI_API_KEY from Worker Secrets (Zero frontend exposure)
        │
        ▼ (Streaming SSE / JSON)
[Google Gemini API (gemini-2.0-flash)]
```

---

### 🧪 Example Test Conversations for Verification

Use these test conversations to confirm that the chatbot delivers dynamic, context-aware answers (not canned scripts):

#### 1. PPE & Mining Safety (English)
> **User:** What PPE is mandatory before entering an underground coal mine in Jharkhand?  
> **Suraksha Mitra:** Before entering an underground mine, you must have 6 essential DGMS-approved items:  
> 1. Certified Hard Hat with a secure cap lamp bracket.  
> 2. Intrinsically safe Miner's Cap Lamp and battery pack.  
> 3. Self-Rescuer (filter or chemical oxygen type) worn on your belt at all times.  
> 4. Steel-toed safety boots with puncture-resistant soles.  
> 5. Heavy-duty dust mask / respirator (N95 or P100 rated).  
> 6. High-visibility fluorescent reflective belt.  
> Never cross the shaft bottom without checking your lamp and self-rescuer seals!

#### 2. Mining Hazard & Ventilation (हिंदी)
> **User:** भूमिगत कोयला खदान में मीथेन गैस का रिसाव होने पर तुरंत क्या करना चाहिए?  
> **Suraksha Mitra:** मीथेन (Firedamp) एक अत्यंत ज्वलनशील और विस्फोटक गैस है। रिसाव का संकेत मिलते ही:  
> 1. **कोई चिंगारी न बनाएं:** किसी भी स्विच, अनधिकृत बैटरी या माचिस का प्रयोग बिल्कुल न करें।  
> 2. **तुरंत काम रोकें:** अपने औजार और मशीनें सुरक्षित रूप से बंद करें।  
> 3. **हवा की दिशा (Fresh Air Base) में जाएं:** हमेशा इनटेक एयरवे (ताजी हवा के मार्ग) की तरफ बाहर निकलें।  
> 4. **सुपरवाइज़र को सूचित करें:** सुरक्षित दूरी पर पहुंचकर खदान के टेलीफोन से तुरंत वेंटिलेशन अधिकारी को सतर्क करें।

#### 3. High-Voltage Electrical Safety (Hinglish)
> **User:** Substation transformer maintenance se pehle LOTO kaise apply karte hain?  
> **Suraksha Mitra:** Substation transformer par bina LOTO ke haath lagana jaanleva ho sakta hai. Ye 6 steps follow karein:  
> 1. **Preparation:** Work Permit (PTW) check karein aur affected teams ko inform karein.  
> 2. **Shutdown:** Transformer ka upstream circuit breaker trip karein.  
> 3. **Isolation:** Isolator switches ko physically open karein.  
> 4. **Lock & Tag:** Isolator handle par apna personal Padlock lagayein aur Danger Tag baandhein.  
> 5. **Stored Energy Discharge:** Earthing switch band karke residual voltage discharge karein.  
> 6. **Verification:** Calibrated high-voltage detector wand se zero potential test karein. Zero confirm hone ke baad hi maintenance shuru karein!

#### 4. Contextual Follow-up (AI Memory Test)
> **Turn 1 (User):** My safety helmet fell from 10 meters and has a small hairline crack.  
> **Turn 1 (Suraksha Mitra):** That helmet has suffered severe structural impact. The internal shell lattice absorbs energy by deforming; even a hairline crack means it has lost its protective integrity against future falling rocks.  
> **Turn 2 (User):** Can I just put industrial duct tape over it and use it for one shift?  
> **Turn 2 (Suraksha Mitra):** **NO, absolutely not.** Tape provides zero impact absorption. Furthermore, adhesives contain solvents that can degrade the helmet's polycarbonate shell. Hand it over to the safety store immediately and get an IS 2925 certified replacement before entering any work zone.

#### 5. Gentle Redirection (Non-Safety Topics)
> **User:** Who won the cricket match yesterday?  
> **Suraksha Mitra:** As your Suraksha Mitra, I stay focused on keeping you safe in the plant and mines! Let's talk safety — are your PPE checks complete for today, or do you have questions about the AR fire and gas modules?

---

### 🚀 Cloudflare Worker Backend Deployment Guide

Because the SurakshaAR frontend is hosted statically on GitHub Pages, the backend proxy runs as an independent serverless function on **Cloudflare Workers** (100,000 free requests/day).

#### Step 1: Install Wrangler CLI & Authenticate
```bash
# Login to your free Cloudflare account
npx wrangler login
```

#### Step 2: Deploy the Worker
```bash
cd worker
npx wrangler deploy
```
*Note your deployed Worker URL from the terminal output (e.g. `https://suraksha-chat-worker.<your-subdomain>.workers.dev`).*

#### Step 3: Set Your Gemini API Key as a Secret
```bash
# Get your free Gemini API key from https://aistudio.google.com/app/apikey
npx wrangler secret put GEMINI_API_KEY
# When prompted, paste your API key (e.g. AIzaSy...)
```

#### Step 4: Update Frontend Environment & Redeploy GitHub Pages
In your project root `.env`:
```env
VITE_CHAT_API_URL=https://suraksha-chat-worker.<your-subdomain>.workers.dev/api/chat
```
Then build and push the new build to your `gh-pages` branch:
```bash
npm run build
cd dist
git add -A
git commit -m "deploy: connect Suraksha Mitra Cloudflare Worker backend"
git push origin gh-pages
```

---

## 🧪 Verification & Testing

```bash
# Run lint check (oxlint)
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 🚀 Deployment to Netlify

The repository is pre-configured for Netlify via [netlify.toml](file:///Users/kishananand/Desktop/SurakshaAR1/netlify.toml):
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **SPA Redirection:** `/* -> /index.html 200`
- **Security Headers:** Strict CSP, X-Frame-Options: DENY, and Permissions-Policy enabled for camera & microphone.

To deploy via Netlify CLI:
```bash
npx netlify deploy --prod --dir=dist
```

---

## 🏆 Smart India Hackathon 2026
- **Problem Statement:** SIH26041
- **Domain:** Industrial Safety & Vocational Skill Development
- **Developed for:** State of Jharkhand — Mining, Steel & Manufacturing Workers
