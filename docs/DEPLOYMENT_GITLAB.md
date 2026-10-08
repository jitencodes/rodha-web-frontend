# GitLab CI/CD — Development & Production

| Branch | Role | GitLab environment |
|--------|------|--------------------|
| `main` | Development | `development` |
| `production` | Production | `production` |

Pipelines are defined in [`.gitlab-ci.yml`](../.gitlab-ci.yml).

## How env isolation works

Public config is committed so the API URL cannot drift between GitLab variables:

| File | Used by | `NEXT_PUBLIC_API_BASE_URL` |
|------|---------|----------------------------|
| `.env` | `main`, local `next dev`, Docker `APP_ENV=development`, Vercel Preview | `https://innowrap.co.in/rodha/` |
| `.env.production` | `production` branch, Docker `APP_ENV=production`, Vercel Production | `https://api.rodha.co.in/rodha/` |

`next build` always sets `NODE_ENV=production` and would load `.env.production` on top of `.env`. `scripts/select-env.mjs` (run by `npm run build`, GitLab, and the Dockerfile) copies the file for `APP_ENV` into `.env` and deletes `.env.production` in the build sandbox so only one URL is baked in.

Do **not** set `NEXT_PUBLIC_API_BASE_URL` in GitLab or Vercel. A dashboard value overrides the committed file and the two environments will collide again.

GitLab variables are for **secrets and deploy keys only** (`EMAIL_SMTP_PASS`, `API_KEY`, `SSH_PRIVATE_KEY`, …). `select-env` appends those secrets when they are missing from the committed file. Put local passwords in gitignored `.env.local`.

## Pipeline jobs

| Job | Branch | When |
|-----|--------|------|
| `validate` | `main`, `production`, MRs | auto — `tsc` + lint |
| `build:development` | `main` | auto — npm `.next` artifacts (PM2 path) |
| `build:production` | `production` | auto — npm `.next` artifacts (PM2 path) |
| `docker:development` | `main` | auto — image → GitLab registry `:development-<sha>` |
| `docker:production` | `production` | auto — image → GitLab registry `:production-<sha>` |
| `deploy:development` | `main` | **manual** — SSH + rsync + pm2 |
| `deploy:production` | `production` | **manual** — SSH + rsync + pm2 |
| `deploy:docker:development` | `main` | **manual** — SSH + `docker compose` pull/up |
| `deploy:docker:production` | `production` | **manual** — SSH + `docker compose` pull/up |

Docker and npm builds both use environment-scoped variables. Image tags never overlap (`development-*` vs `production-*`).

### Docker locally

```bash
cp .env.example .env   # fill values (NEXT_PUBLIC_* baked at image build)
docker compose up --build
# app on http://localhost:3000
```

Enable the GitLab Container Registry for the project. Runners need the Docker executor / `docker:dind` privileged mode for `docker:development` / `docker:production` jobs.

## Variables to configure manually

Create **two scopes** (`development` and `production`) for each app key unless noted.

### Required for build (both environments)

| Variable | Protected? | Mask? | Notes |
|----------|------------|-------|-------|
| `NEXT_PUBLIC_BASE_URL` | prod: yes | no | Site origin, e.g. `https://dev.rodha.co.in` / `https://rodha.co.in` |
| `NEXT_PUBLIC_API_BASE_URL` | — | — | Do not set in CI. Dev file `https://innowrap.co.in/rodha/`, prod file `https://api.rodha.co.in/rodha/`. |
| `NEXT_PUBLIC_API_SOURCE` | no | no | Usually `website` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | no | no | OAuth Web client. Google Console **Authorized JavaScript origins** must include each site origin (`http://localhost:3000`, Vercel URL, `https://rodha.co.in`, `https://www.rodha.co.in`). Redeploy after changing the env var. |

### Recommended / feature flags

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_DEFAULT_HOME_PATH` | e.g. `/category/cat` or `/` |
| `NEXT_PUBLIC_GRAPHY_DASHBOARD_URL` | Live Classroom base |
| `NEXT_PUBLIC_THINK_EXAM_URL` | Take Test URL |
| `NEXT_PUBLIC_CAT_COMMUNITY_URL` | WhatsApp community |
| `NEXT_PUBLIC_BROCHURE_URL` | Brochure PDF |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (often prod-only) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Default `contactus@rodha.co.in` |
| `NEXT_PUBLIC_ANNOUNCEMENT_INTERVAL_MS` | e.g. `8000` |
| `NEXT_PUBLIC_EMAIL_LOGO_URL` | Absolute logo URL for emails |
| `API_KEY` | **Mask + Protect** if used |
| `API_REVALIDATE_SECONDS` | e.g. `60` |

### Server-only SMTP (mask secrets)

| Variable | Mask? |
|----------|-------|
| `EMAIL_SMTP_HOST` | no |
| `EMAIL_SMTP_PORT` | no |
| `EMAIL_SMTP_SECURE` | no |
| `EMAIL_SMTP_USER` | yes |
| `EMAIL_SMTP_PASS` | **yes** |
| `EMAIL_FROM` | no |
| `EMAIL_FROM_NAME` | no |
| `EMAIL_TO` | no |

### Deploy (optional, environment-scoped)

| Variable | Mask? | Notes |
|----------|-------|-------|
| `DEPLOY_HOST` | no | Server hostname/IP |
| `DEPLOY_USER` | no | SSH user |
| `DEPLOY_PATH` | no | Absolute app directory on server |
| `SSH_PRIVATE_KEY` | **yes** | Deploy key (full PEM) |
| `DEPLOY_SSH_KNOWN_HOSTS` | no | Optional pinned `known_hosts` lines |
| `DEPLOY_PM2_NAME` | no | Default `rodha-web` (PM2 deploys only) |
| `DEPLOY_PORT` | no | Host port for Docker deploy (default `3000`) |

Registry login on the deploy host uses GitLab’s built-in `CI_REGISTRY_*` (no extra vars). Host must have Docker + Compose v2.

Use **different** `DEPLOY_HOST` / `DEPLOY_PATH` (or PM2 name / port) per environment so a development deploy never overwrites production.

## Branch protection (recommended)

In GitLab → **Settings → Repository → Protected branches**:

- Protect `production`: Maintainers only (or merge via MR from `main`).
- Optionally protect `main` similarly for the team.

Suggested flow: develop on `main` → MR → merge to `production` when releasing.

## Local parity

```bash
# npm
npm ci
npm run build
npm start

# Docker
cp .env.example .env
docker compose up --build

# Do not commit real .env files — only .env.example is tracked.
```

## Validation checklist

1. [ ] Create GitLab environments `development` and `production` (created automatically on first job, or under Deployments → Environments).
2. [ ] Add all required variables scoped to each environment (no unscoped duplicates).
3. [ ] Enable Container Registry; ensure runners support `docker:dind` (privileged).
4. [ ] Push to `main` → `validate` + `build:development` + `docker:development`.
5. [ ] Push to `production` → `validate` + `build:production` + `docker:production`.
6. [ ] (Optional) Configure deploy SSH vars → manually run PM2 or Docker deploy job.
7. [ ] Confirm each site hits the correct API (`NEXT_PUBLIC_API_BASE_URL`) and OAuth client.
