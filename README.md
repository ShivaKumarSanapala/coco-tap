# Coco Tap — Mobile Web App

Mobile-first web app for collecting **coconut tap audio + labels + metadata** for an ML experiment. One flow: record → playback → label → submit. No auth, no ML inference.

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL and anon key (see Backend setup below)
npm run dev
```

Open `http://localhost:5173` (or the URL Vite prints). Use Chrome DevTools device toolbar or a real phone on the same network for mobile testing.

## Backend setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. **Storage**: In Dashboard → **Storage**, click **New bucket**. Create a bucket with name **exactly** `coco-tap-audio` (or set `VITE_SUPABASE_BUCKET` in `.env` to whatever name you use). Set it to **Public** (or keep private and use signed URLs later). Open the bucket → **Policies** → **New policy**:
   - **Insert**: Policy name e.g. "Allow anon upload", Target roles `anon`, Allowed operation `INSERT`, with check expression `true`.
   - **Select**: (optional) allow `anon` to read if you need public playback of files.
3. **Database**: In SQL Editor, run the contents of `supabase/schema.sql`. This creates the `samples` table and RLS policies so the app can insert rows without auth.
4. Copy **Project URL** and **anon public** key from Settings → API into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

Without these env vars, the app still runs; the Submit step will fail with "Supabase not configured". **"Bucket not found"** means the Storage bucket is missing: in Dashboard → Storage create a bucket named `coco-tap-audio` (or set `VITE_SUPABASE_BUCKET` in `.env` to match your bucket), then add the anon insert policy.

## Data stored per sample

| Field | Source |
|-------|--------|
| `audio_path` | Filename in bucket (timestamp + UUID + .webm or .m4a) |
| `label` | User: tender \| medium \| mature |
| `environment` | User: indoor \| outdoor (optional) |
| `num_taps` | User: 3 \| 4 \| 5 (optional) |
| `recording_duration_sec` | Fixed 4s |
| `recorded_at` | Client timestamp |
| `device_type` | From UA: mobile \| desktop |
| `browser` | From UA: Chrome, Safari, etc. |
| `os` | From UA: Android, iOS, etc. |
| `ip` | From Vercel request (deployed only) |
| `country`, `city`, `region` | From Vercel geo headers (deployed only) |
| `session_id` | UUID per tab (sessionStorage) |
| `visitor_id` | UUID per browser (localStorage) |

If you already had the `samples` table, run the migration ALTERs at the bottom of `supabase/schema.sql` once in the SQL Editor.

Audio is stored as-is (no client-side conversion): `.webm` (Chrome/Android), `.m4a` (Safari/iOS).

## iOS vs Android behavior

- **iOS Safari**
  - Mic access **must** be requested in a **user-initiated** action (e.g. tap “Start”). We do not call `getUserMedia` on page load.
  - MediaRecorder often outputs `audio/mp4` (saved as `.m4a`). We accept that and upload raw.
  - Lock screen or backgrounding can stop recording; we use a fixed 4s so it usually finishes in foreground.
- **Android Chrome**
  - Typically uses `audio/webm;codecs=opus`. We upload the blob as-is.
  - Permissions and recording are generally straightforward; handle denial with the in-app error message.
- **HTTPS**: `getUserMedia` and MediaRecorder require a secure context. Use `https` in production; locally Vite serves over HTTP and Chrome allows `localhost` as secure.

## Hosting (deploy the app)

The app is a static Vite build. Two simple options:

### Option A: Vercel (recommended)

1. **Push your code to GitHub** (if not already).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New** → **Project**, import your `coco-tap` repo.
4. **Environment variables** (required for Supabase):
   - In the project setup, open **Environment Variables**.
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key
   - Optional: `VITE_SUPABASE_BUCKET` = `coco-tap-audio` (or your bucket name; this is the default).
5. Click **Deploy**. Vercel will run `npm run build` and serve the app. The `api/` folder is deployed as serverless functions (used for IP/geo when hosted).
6. Your app will be live at `https://your-project.vercel.app`. You can add a custom domain in Project Settings.
7. **Auto-deploy**: Pushing to the connected branch (usually `main`) triggers a new deployment automatically.

### Option B: Netlify

1. Push code to GitHub (or GitLab/Bitbucket).
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
3. Connect your repo. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment variables**: Site settings → **Environment variables** → Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (and optionally `VITE_SUPABASE_BUCKET`).
5. Deploy. The site will be at `https://something.netlify.app`.

**Note:** `getUserMedia` and recording require **HTTPS**. Both Vercel and Netlify serve over HTTPS by default, so recording will work on the hosted app.

## Build only (no deploy)

```bash
npm run build
```

Output is in `dist/`. You can serve that folder from any static host; set the same `VITE_*` env vars in the host's dashboard so they are baked into the build.

## Tech stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Storage + Postgres)
- **Audio**: `navigator.mediaDevices.getUserMedia` + `MediaRecorder` (browser-native only)

## Non-goals (not in this app)

- ML inference
- Waveform visualization
- Offline mode
- Login / accounts
- Analytics beyond basic metadata
