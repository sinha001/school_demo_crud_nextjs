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
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT` (optional)

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
