# GitLab CI/CD — Development & Production

| Branch | Role | GitLab environment |
|--------|------|--------------------|
| `main` | Development | `development` |
| `production` | Production | `production` |

Pipelines are defined in [`.gitlab-ci.yml`](../.gitlab-ci.yml).

## How env isolation works

Use the **same variable names** in both environments. In GitLab:

**Settings → CI/CD → Variables → Add variable**

| Field | Development | Production |
|-------|-------------|------------|
| Key | e.g. `NEXT_PUBLIC_API_BASE_URL` | same key |
| Value | **dev** API / URLs | **prod** API / URLs |
| Environment scope | `development` | `production` |
| Protect variable | optional | recommended **Yes** |
| Mask variable | for secrets | for secrets |

Jobs declare `environment: name: development|production`, so GitLab injects only that scope’s values.  
**Do not** create unscoped copies of the same keys — they can override or conflict.

Build jobs run `scripts/ci-write-env.mjs` to materialize a job-local `.env` from those variables (values are never printed).

## Pipeline jobs

| Job | Branch | When |
|-----|--------|------|
| `validate` | `main`, `production`, MRs | auto — `tsc` + lint |
| `build:development` | `main` | auto |
| `build:production` | `production` | auto |
| `deploy:development` | `main` | **manual** |
| `deploy:production` | `production` | **manual** |

Deploy uses SSH + `rsync` + `pm2` when deploy variables are set. Until then, use **Play** on the deploy job only after configuring the secrets below (or skip deploy and ship artifacts another way).

## Variables to configure manually

Create **two scopes** (`development` and `production`) for each app key unless noted.

### Required for build (both environments)

| Variable | Protected? | Mask? | Notes |
|----------|------------|-------|-------|
| `NEXT_PUBLIC_BASE_URL` | prod: yes | no | Site origin, e.g. `https://dev.rodha.co.in` / `https://rodha.co.in` |
| `NEXT_PUBLIC_API_BASE_URL` | prod: yes | no | API base with trailing `/` |
| `NEXT_PUBLIC_API_SOURCE` | no | no | Usually `website` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | no | no | OAuth Web client (origins must match each env URL) |

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
| `DEPLOY_PM2_NAME` | no | Default `rodha-web` |

Use **different** `DEPLOY_HOST` / `DEPLOY_PATH` (or PM2 name) per environment so a development deploy never overwrites production.

## Branch protection (recommended)

In GitLab → **Settings → Repository → Protected branches**:

- Protect `production`: Maintainers only (or merge via MR from `main`).
- Optionally protect `main` similarly for the team.

Suggested flow: develop on `main` → MR → merge to `production` when releasing.

## Local parity

```bash
# Development-like build (use your .env)
npm ci
npm run build

# Do not commit real .env files — only .env.example is tracked.
```

## Validation checklist

1. [ ] Create GitLab environments `development` and `production` (created automatically on first job, or under Deployments → Environments).
2. [ ] Add all required variables scoped to each environment (no unscoped duplicates).
3. [ ] Push to `main` → pipeline runs `validate` + `build:development`.
4. [ ] Push to `production` → pipeline runs `validate` + `build:production`.
5. [ ] (Optional) Configure deploy SSH vars → manually run deploy job.
6. [ ] Confirm each site hits the correct API (`NEXT_PUBLIC_API_BASE_URL`) and OAuth client.
