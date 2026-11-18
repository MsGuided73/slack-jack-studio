# Running Parallax on a Coolify server

Parallax runs as one container built from the `Dockerfile` at the top of this repository.
These steps put it on a server managed by [Coolify](https://coolify.io) at an address of
your own, for example `https://parallax.example.com`.

Read [`SECURITY.md`](../SECURITY.md) first. Parallax is young software.

## 1. Add the app

1. In Coolify, open your project and choose **New resource**.
2. Pick this repository (a public repository by its address, or your own fork through the
   GitHub app) and the `main` branch.
3. Set **Build pack** to **Dockerfile**. The Dockerfile location is `/Dockerfile`.
4. Set **Ports exposes** to `3000`.

## 2. Keep the data

The database and every file people make live in `/data` inside the container. Without a
volume they are lost each time the app is redeployed.

Under **Persistent storage**, add a **volume mount**:

| Field | Value |
|---|---|
| Name | `parallax-data` |
| Destination path | `/data` |

Use a volume, not a directory on the server. The app runs as the `node` user, and Docker
gives a new volume to that user; a server directory would belong to root and the app could
not write to it.

## 3. Settings

Under **Environment variables**, set:

| Variable | Value | Why |
|---|---|---|
| `PARALLAX_ORIGIN` | `https://parallax.example.com` | The public address. The server writes its links with it and accepts requests from pages at that address |
| `COOKIE_SECURE` | `1` | Marks the session cookie Secure, since the app is served over https |
| `PARALLAX_DEMO_BILLING` | `off` | Closes the top-up button that adds credits for free |

Optional:

| Variable | Value | Why |
|---|---|---|
| `PARALLAX_DEMO_SEED` | `1` | Fills a new, empty data volume with the demo accounts and posts |
| `TREG_TOKEN` | your key | Turns on real generations. Without it every model answers with a sample file. Mark it as a secret |
| `TREG_DAILY_BUDGET_USD` | `5` | Stops paid requests after this many dollars in 24 hours. Set it whenever `TREG_TOKEN` is set |

The container sets `SUPER_MODE=mock`, so Supercomputer cannot start cloud computers or
connect outside apps by accident. Change it only after reading `docs/api/super.md`.

## 4. The address

1. Under **Domains**, enter `https://parallax.example.com`.
2. At your DNS provider, add an `A` record for `parallax` that points at the server's
   address.
3. Deploy.

If the DNS is on Cloudflare with the proxy (orange cloud) on, set the zone's SSL/TLS mode
to **Full (strict)**, not **Flexible**. With Flexible, Cloudflare talks to the server over
plain http, the server redirects to https, and the page loops.

## 5. Check it

- The deployment's health check turns green. It asks the app for its home page.
- `https://parallax.example.com` opens, and you can sign up.
- Redeploy once and sign in again. If your account is still there, the volume works.

## Updating

Redeploy from Coolify after the branch changes. The data stays in the volume, and new
database migrations are applied when the app starts.

## What the image holds

- Node.js 22 and the built app, with the build-only packages removed.
- `ffmpeg`, so the Cinema page can join shots into one film and uploads get thumbnails
  and durations. Parallax works without it.
