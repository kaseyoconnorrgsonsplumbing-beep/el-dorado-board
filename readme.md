# El Dorado — Room Progress board

A mobile-first progress + info board for the hospital job. Track each room
room-by-room: tasks with subtasks that roll up a completion %, photos, notes,
and a schedule — all opened by scanning a QR code posted on the front of the room.

Built in the RG & Sons Field UI style, same single-file pattern as the
Proposal Writer app, and wired to the same Firebase project (`rgsons-37f42`)
so every phone sees live progress.

## Files

- **index.html** — the entire app (HTML + CSS + JavaScript in one file). This
  is where you make changes.
- **config.js** — Firebase connection + which collections this board uses.
  Ships with the real `rgsons-37f42` keys, so it connects to office sync out
  of the box. It keeps its data in its **own** collections and never touches
  `tickets`.
- **qrcode.min.js** — QR-code generator, bundled locally (no internet needed
  to make labels).
- **firestore.rules / storage.rules** — security rules for the El Dorado
  collections + photo folder (see "Lock down" below).

Firebase itself loads from Google's CDN inside `index.html` — nothing to install.

## Running it

Open `index.html` in a browser (double-click). No build step. It works
immediately: if it can reach Firebase it shows **"Office connected"** (live,
shared across phones); if not it shows **"Local only"** and keeps everything in
that browser.

> For QR scanning to actually work across phones on-site, the app has to be
> **hosted at a URL** (see Deploy). A QR label just points a phone at
> `<your app URL>/?room=<room id>`.

## First-time setup (in the app)

1. Open the app, tap **Config**.
2. Fill in **Job name / #, address**.
3. Under **Rooms**, add each room number and check **ADA** where it applies.
4. Under **Task template**, adjust the standard task + subtask list. This one
   list applies to every room. A sensible plumbing default is pre-loaded —
   edit names, add/remove subtasks, reorder, then **Save template**.
5. Back on the overview, tap **Print QR labels**, print the sheet, and post
   each label on the front of its room.

### Users, PINs & breadcrumbs

The board tracks **who did what** with a lightweight 4-digit PIN login.

- **You (the office):** in Config, set **Your name** and a **4-digit Admin PIN**,
  then Save admin PIN. From then on, Config and the user-approval panel only open
  with that PIN — workers scanning rooms can't get in. (Until you set an admin
  PIN, Config is open so you can do first-time setup.)
- **Workers:** when someone scans a room and taps to check off work, add a photo,
  or add a note, they're asked for a PIN. First time, they fill a short form —
  **name, company, and a PIN they choose** (PINs are unique; the app rejects one
  that's already used). That creates a **request** that shows on your dashboard.
- **You confirm:** approved requests appear on your overview as "N user requests
  waiting"; open Config → **Users & access** → **Confirm** (or ✕ to deny). Once
  confirmed, they log in with their PIN and can edit.
- **Breadcrumbs:** every checked subtask, note, and photo is stamped with the
  person's **name + company**. Workers stay logged in on their phone until they
  tap **Log out**.

> Security note: this is a static site with no server-side login, so PINs are
> **lightweight identity for accountability**, not high security — they live in
> the database the app reads. Great for "who did what" on a jobsite; don't treat
> a PIN like a bank password. Keep the Firebase rules in mind (below).

### Completion dates

Checking a subtask records **today** as its completed date and who did it. If it
was checked on the wrong day, tap the green date chip on that line to pick the
correct date.

### How progress rolls up

Each **subtask** you check fills its **task**'s bar (e.g. 2 of 4 subtasks = 50%).
The **room** percentage is every completed subtask across every task, and the
**overall** number on the dashboard is the whole job.

## Deploy (so QR codes work)

The app is static files — host them at any URL. The QR labels are generated
from wherever the app is hosted, so they point at the live site automatically —
no URL to hard-code. Open the deployed URL once and do the Config setup above.

### GitHub Pages (this repo)

This repo serves the app straight from GitHub Pages:

- Live site: `https://<your-username>.github.io/<repo-name>/`
- **To update the app:** change the files and push to `main` (or edit a file
  right on github.com and commit). Pages redeploys itself in about a minute.
- Settings → Pages on GitHub shows the URL and deploy status.

### Netlify (alternative)

1. Put `index.html`, `config.js`, `qrcode.min.js` in one folder.
2. Drag that folder onto **Netlify** (app.netlify.com → "Add new site" →
   "Deploy manually"), or upload to any static host.
3. To update later, re-upload the changed files.

## ⚠️ Lock down your Firebase security rules

The PIN login is app-level only (see the security note above), so whatever your
Firestore + Storage *rules* allow, anyone with the URL can do. The included
`firestore.rules` / `storage.rules` open **only** the El Dorado collections
(`eldorado_config`, `eldorado_rooms`, `eldorado_users`) and the `eldorado/`
photo folder — they don't touch your `tickets`. Merge them into your existing
rules in the Firebase console before sharing the link widely, and tighten to
require real auth if this ever needs to be truly private.

Data locations in Firebase (`rgsons-37f42`):
- Firestore: `eldorado_config/main` (job, task template, admin PIN),
  `eldorado_rooms/<roomId>` (one doc per room), `eldorado_users/<userId>`
  (each worker's name, company, PIN, approval status)
- Storage: `eldorado/<roomId>/<photo>`

## Making changes

Everything is in `index.html`:
- Theme/tokens: the `:root` block + `<style>` near the top (RG Field UI style).
- Screens (overview / room board / config / QR labels): the render functions.
- Logic (progress math, Firebase, QR): the `<script>` block.
