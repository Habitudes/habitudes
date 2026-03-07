# Habitudes — habitudes.app

## Deploy to Vercel in 3 steps

1. Push this folder to a GitHub repo (public or private)
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Vite. Click Deploy.

## Custom domain (habitudes.app)

In Vercel dashboard → your project → Settings → Domains:
- Add `habitudes.app`
- Add `www.habitudes.app`
- Vercel gives you DNS records to add in Namecheap

## Local dev

```bash
npm install
npm run dev
```

## Notes

- User data is stored in localStorage keyed to passphrase
- No backend, no database — fully client-side
- The demo mode shows a pre-seeded year of data

## Notifications

Daily reminders use the browser Notification API (no backend needed).

**On iOS:** notifications only work from the Home Screen app (PWA).
Users must:
1. Open habitudes.app in Safari
2. Share → Add to Home Screen
3. Open the installed app
4. Enable reminder in Today tab

**On Android/Desktop Chrome:** works directly in the browser.

The app fires a notification once per day at the user's chosen time,
tracked via localStorage (no server calls).
