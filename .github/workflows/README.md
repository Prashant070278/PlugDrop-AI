# GitHub Actions — Hostinger FTP Deployment

The deployment is handled by `.github/workflows/deploy.yml`.

## What it does
1. Triggers on every push to `main` (and via manual `Run workflow`).
2. Checks out the repo and installs Yarn dependencies for `frontend/` using the lockfile.
3. Builds the CRACO/React app with `yarn build`, producing `frontend/build/`.
4. Verifies the build output exists.
5. Uploads `frontend/build/` to Hostinger via FTP using **SamKirkland/FTP-Deploy-Action@v4.3.5**
   (replacement for the broken `presshold/sftp-deploy@v1.2.1`).

## Required GitHub Secrets

In your repository → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name              | Description                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `FTP_USERNAME`           | Your Hostinger FTP username (from hPanel → Files → FTP Accounts). Usually like `u858921777` or `user@plugdrop.ai`. |
| `FTP_PASSWORD`           | The password for that FTP account.                                                                         |
| `REACT_APP_BACKEND_URL`  | The public URL of your backend (e.g. `https://api.plugdrop.ai`). Injected at build time.                   |

> Host (`82.112.239.180`) and port (`21`) are hardcoded in the workflow as per Hostinger's specs.
> Server path is hardcoded to `/home/u858921777/domains/plugdrop.ai/public_html/`.

## Manual triggering

Go to **Actions → Deploy frontend to Hostinger (FTP) → Run workflow**.

## Why we switched

The previous workflow used `presshold/sftp-deploy@v1.2.1`, which no longer exists on the GitHub
Actions Marketplace. `SamKirkland/FTP-Deploy-Action@v4.3.5` is the actively maintained,
well-documented standard for FTP/FTPS deploys to shared hosting providers like Hostinger.
