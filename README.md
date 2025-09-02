# School Details Enhancement (Next.js + MySQL, JS/JSX)

Two-page app to add and browse school details, built with Next.js App Router (plain JS/JSX) and MySQL as the only data source.

- Add School (form): `/addSchool`
- Show Schools (listing): `/showSchools`
- API: `/api/schools` (GET/POST)

No sample data or in-memory fallback is used. Images are stored as base64 data URLs in MySQL.

## Tech
- Next.js App Router (JS/JSX)
- API Routes (server) with `mysql2/promise`
- `react-hook-form` for validation (client form)
- Basic styling (no component library)

## Database schema
Use LONGTEXT for the image column to prevent truncation.
\`\`\`sql
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  contact TEXT NOT NULL,
  image LONGTEXT NOT NULL,   -- stores full data URL: data:image/png;base64,....
  email_id TEXT NOT NULL
);
\`\`\`

## Environment variables
Set these in your hosting/platform settings:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_PORT` (optional)

## API
- GET `/api/schools`
  - Returns: `[{ id, name, address, city, state, contact, email_id, image }]`
- POST `/api/schools`
  - Body (JSON):
    \`\`\`json
    {
      "name": "Green Valley High School",
      "address": "12 Lakeview Rd",
      "city": "Pune",
      "state": "Maharashtra",
      "contact": "+91 9876543210",
      "email_id": "info@gvhs.edu",
      "image": "data:image/png;base64,iVBORw0..." // full data URL (prefix + payload)
    }
    \`\`\`
  - Server validation:
    - All text fields required
    - `email_id` must be valid
    - `image` must be a full data URL with payload and an allowed type (png/jpeg/jpg/webp/gif)
  - Stored as-is in `image` (LONGTEXT)

## Client form (what it does)
- Converts the selected file (PNG/JPG/WebP) into a base64 data URL in the browser using `FileReader`
- Sends the full data URL string in JSON to the POST endpoint
- Validates inputs with `react-hook-form`

## Run locally
Typical Next.js workflow:
1. Ensure MySQL is running and the `schools` table exists.
2. Create a `.env.local` with the env vars above.
3. Install deps and start dev server:
   \`\`\`bash
   npm install
   npm run dev
   # or: pnpm i && pnpm dev
   \`\`\`
4. Visit:
   - Add: http://localhost:3000/addSchool
   - List: http://localhost:3000/showSchools

## Deploy
- Add all MySQL env vars in your host (Vercel/Netlify/etc.)
- Ensure the database is reachable from the platform (allowlisted, public, or via tunnel)
- Create the `schools` table before first use

## Using FreeSQLDatabase.com (5 MB trial)

You can deploy this app on Vercel and connect it to a FreeSQLDatabase.com MySQL instance. Map their credentials to these environment variables:

- DB_HOST = your FreeSQLDatabase host (e.g., sql.freedb.tech)
- DB_NAME = your database name (e.g., freedb_my_db)
- DB_USER = your username (e.g., freedb_my_user)
- DB_PASSWORD = your password
- DB_PORT = 3306 (or the port shown in the dashboard)

Steps
1) Create the database on FreeSQLDatabase.com and copy Hostname, Database, Username, Password, and Port.
2) In Vercel → Project → Settings → Environment Variables, add:
   - DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT
   - Optional: SITE_URL = https://your-project-name.vercel.app (use for server-side absolute fetches)
3) Create the table (use their SQL console or any MySQL client):
   \`\`\`sql
   CREATE TABLE IF NOT EXISTS schools (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     city TEXT NOT NULL,
     state TEXT NOT NULL,
     contact TEXT NOT NULL,
     image LONGTEXT NOT NULL,   -- stores full data URL: data:image/png;base64,....
     email_id TEXT NOT NULL
   );
   \`\`\`
4) Deploy on Vercel (Node runtime; do NOT use Edge for the API). After deploy, re‑deploy if you added env vars after the first build.

Important notes about the 5 MB limit
- Base64 images are large: a 60 KB PNG/JPG becomes ~80 KB base64. With 5 MB total DB space, you’ll run out quickly.
- To avoid hitting the quota:
  - Keep uploads small (suggested ≤ 40–60 KB per image).
  - Or store only an image URL in MySQL and host images externally (e.g., Vercel Blob, Cloudinary, Imgur). If you want, we can switch the app to save URLs instead of base64.
- If you hit storage errors, delete rows or increase your plan.

Connectivity/SSL tips
- Many FreeSQLDatabase instances work without custom SSL options. If you see an SSL error, set SSL in your MySQL pool:
  - In lib/db.js: `ssl: { rejectUnauthorized: true }` (or your provider’s recommended SSL settings).
- Ensure your provider allows external connections; Vercel’s IPs are dynamic, so providers that require a fixed IP allowlist can be problematic.

Quick API checks (after deploy)
- GET schools:
  \`\`\`bash
  curl -s https://your-project-name.vercel.app/api/schools | jq .
  \`\`\`
- POST a new school (small JPG/PNG):
  \`\`\`bash
  # prepare base64 (macOS/Linux)
  DATA_URL="data:image/jpeg;base64,$(base64 -w 0 school.jpg)"
  curl -X POST https://your-project-name.vercel.app/api/schools \
    -H "content-type: application/json" \
    -d '{
      "name":"Test School",
      "address":"123 Lane",
      "city":"City",
      "state":"State",
      "contact":"+91 9999999999",
      "email_id":"info@test.edu",
      "image":"'"$DATA_URL"'"
    }'
  \`\`\`

Troubleshooting with FreeSQLDatabase
- Broken images: make sure the `image` field in MySQL starts with `data:image/...;base64,` and contains a long payload after the comma. Column must be LONGTEXT.
- “ECONNREFUSED/ETIMEDOUT”: verify host/port/credentials and that your DB accepts external connections.
- “Failed to parse URL from /api/schools”: server components must use absolute URLs. Either use SITE_URL or fetch on the client (SWR).

## Troubleshooting
- Image not visible (broken image icon):
  - Check DB value: it must start with `data:image/...;base64,` and contain a long payload after the comma.
  - Ensure column type is `LONGTEXT` (not `TEXT`).
  - Re-add the school so a fresh value is saved.
- “Invalid or empty image data”:
  - The form must send a full data URL; choose a real image file. PNG and JPG/JPEG are accepted.
- “Failed to parse URL from /api/schools” in server components:
  - Server fetches need absolute URLs or a client-side fetch. Ensure the page builds an absolute URL (awaiting headers) or move the fetch to a client component with `fetch('/api/schools')`.
- MySQL connection errors:
  - Verify env vars, host/port reachability, and user privileges.
  - Confirm the `schools` table exists and matches the schema above.

## Project structure (high-level)
- `app/addSchool/page.jsx` — Add School form page
- `app/showSchools/page.jsx` — Listing page
- `app/api/schools/route.js` — API (GET/POST) using MySQL
- `components/SchoolForm.jsx` — Client form + file→base64
- `components/SchoolCard.jsx` — School card UI
- `lib/db.js` — MySQL connection helper

## License
MIT
