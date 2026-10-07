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

All jobs are tagged **`arm`** (ARM64 runner, shell executor + Docker). Node runs inside `node:20-alpine` via `docker run`.

| Job | Branch | What |
|-----|--------|------|
| `validate` | `main`, `production`, MRs | `tsc` + lint |
| `build` | `main` → `production` (for now), `production` → `production` | `docker build` (Dockerfile) → push to ECR `:<env>-<sha>` and `:<env>-latest` |
| `deploy` | `main` → production (auto, for now), `production` (**manual**) | SSH to EC2 → `docker pull` → restart container `rodha-web-<env>` on host port `APP_PORT` (default `3000`) |

### EC2 deploy variables (environment-scoped)

| Variable | Notes |
|----------|-------|
| `EC2_HOST` | EC2 public IP / hostname |
| `EC2_USER` | SSH user, e.g. `ubuntu` / `ec2-user` |
| `EC2_PORT` | SSH port (default `22`) |
| `PEM_FILE` | SSH private key — GitLab **File** variable (Type: File) |

EC2 only needs Docker, with `EC2_USER` in the `docker` group. The ECR login token is created on the runner and sent over SSH, so EC2 needs no AWS CLI or credentials. Runtime env is written to `~/rodha-web/<env>.env` on the host and passed with `--env-file`.

The image repository is `ECR_IMAGE` in `.gitlab-ci.yml` → `variables`. ECR login uses the GitLab variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` (masked) and `AWS_DEFAULT_REGION`, through the `amazon/aws-cli` image.

The Dockerfile is the only production build path. `docker-compose.yml` is for local development:

```bash
cp .env.example .env   # fill values (NEXT_PUBLIC_* baked at image build)
docker compose up --build
# app on http://localhost:3000
```

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
3. [ ] `AWS_*` variables set; the key can push to the ECR repo.
4. [ ] Push to `main` → `validate` + `build` (`development-*` tags).
5. [ ] Push to `production` → `validate` + `build` (`production-*` tags).
6. [ ] Confirm each site hits the correct API (`NEXT_PUBLIC_API_BASE_URL`) and OAuth client.
