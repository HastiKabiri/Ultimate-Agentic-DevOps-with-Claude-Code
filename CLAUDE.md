# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS portfolio website deployed to AWS using S3 and CloudFront, provisioned with Terraform, and automated via GitHub Actions.

There is no build step, no package manager, no tests, and no linter. "Building" means editing the HTML/CSS/JS files directly.

## Architecture

HTML5 and CSS3, plus one React component loaded from CDN. No build step, no bundler, no JSX.

### Site
- `index.html` — single-page portfolio (About, Services, Courses, Books, Community, Contact); shares `style.css`.
- `privacy.html` / `terms.html` — standalone pages with their own inline styles (changes to `style.css` do not affect them).
- `style.css` — all shared styling, mobile-first responsive with breakpoints at 900px, 768px, 600px.
- `js/testimonials.js` — React testimonials carousel mounted into `#testimonials-root` in the Community section. Testimonial data lives in the `TESTIMONIALS` array at the top of the file.
- The site root is the repo root: every file not excluded by the S3 sync gets published. New non-site files at the root (configs, notes) must be added to the sync `--exclude` list in both `.github/workflows/deploy.yml` and `.claude/skills/deploy/SKILL.md`.

### Infrastructure (`terraform/` — not yet generated)
`terraform/` does not exist in the repo yet; it is produced by the `/scaffold-terraform` skill from `.claude/skills/scaffold-terraform/template-spec.md`. That spec is the source of truth: private S3 bucket + CloudFront **OAC** (not legacy OAI), `index.html` default root, 404 → `/index.html` (200), redirect-to-https, `PriceClass_200`, `CachingOptimized` policy, `Project`/`Environment` tags. The S3 state backend in `backend.tf` starts commented out — apply once with local state, then uncomment and `terraform init -migrate-state`.

Terraform outputs (`cloudfront_distribution_id`, `cloudfront_domain_name`, `s3_bucket_name`, `s3_bucket_arn`) are what the `/deploy` skill reads, so keep those output names stable.

### CI/CD (`.github/workflows/deploy.yml`)
On push to `main`: assumes an AWS role via GitHub OIDC (no stored keys), `aws s3 sync . s3://<bucket> --delete` with excludes, then invalidates CloudFront `/*`.

The workflow currently **hardcodes** the course author's AWS account ID, role ARN, region (`eu-north-1`), bucket name, and distribution ID. These do not come from Terraform outputs and must be updated to match this fork's infrastructure. The OIDC provider and IAM role are not part of the Terraform template spec.

## Skills (`.claude/skills/`)

Infrastructure and deployment work goes through these skills (all `disable-model-invocation: true`, so the user must invoke them):

```
/scaffold-terraform [region] [project-name]  → generate terraform/ from template-spec.md (defaults: ap-south-1, portfolio-site)
/tf-plan                                     → terraform plan + risk/blast-radius summary
/tf-apply                                    → terraform apply -auto-approve + verify CloudFront is "Deployed"; never auto-retry on failure
/deploy                                      → read terraform outputs, s3 sync, CloudFront invalidation; stop on first failure
```

## Commands

```bash
# Local preview — just open the file in a browser (Windows)
start index.html

# Terraform (after /scaffold-terraform)
cd terraform && terraform init && terraform plan
cd terraform && terraform init && terraform plan && terraform apply

# Manual deploy (CI does this on push to main)
aws s3 sync . s3://$BUCKET_NAME --delete --exclude ".git/*" --exclude ".github/*" --exclude ".claude/*" --exclude "terraform/*" --exclude ".mcp.json" --exclude "*.md"
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

## Conventions
- All AWS changes go through Terraform; don't modify resources manually.
- Pushing to `main` deploys to production.
- DMI ownership rule (from README): before deploying, the footer in `index.html` must include a visible "Deployed by:" line (cohort, name, group, week, date) alongside the existing "Crafted with cloud excellence by Pravin Mishra" line.
- The README describes the Week 1 alternative (Ubuntu VM + Nginx, served at `http://<public-ip>`); the S3/CloudFront path above is the one this repo's tooling targets.
- All infrastructure changes go through Terraform — never modify AWS resources manually
- JavaScript is limited to React components in `js/`, using React 18 UMD + `htm` from CDN (with SRI hashes in `index.html`). No JSX, no npm, no build step. Keep everything else plain HTML/CSS.
- CSS uses mobile-first approach with breakpoints at 900px, 768px, and 600px


## Safety
- Never put secrets in this file. No API keys, passwords, or AWS credentials.
