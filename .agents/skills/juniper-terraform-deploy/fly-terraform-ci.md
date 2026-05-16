# Juniper Terraform, Fly, And CI

The checked-in infrastructure is Fly.io plus Terraform Cloud orchestration. Follow the repo files before any older notes that mention Render.

## Source Of Truth

Use these files first:

- `terraform/main.tf`
- `terraform/variables.tf`
- `terraform/environments/*.tfvars`
- `.github/workflows/ci.yml`
- `fly.toml`
- `fly.integration.toml`

If a written instruction conflicts with those files, call out the mismatch and prefer the current checked-in implementation unless the user asks to migrate platforms.

## Terraform Responsibilities

In this repo Terraform provisions the Fly app shell and persistent volume.

- `fly_app` creates the Fly application
- `fly_volume` provisions the SQLite data volume
- Terraform Cloud workspaces are selected with `TF_WORKSPACE`
- Integration and production each use their own tfvars file

## CI Deployment Sequence

The current pipeline in `.github/workflows/ci.yml` is:

1. Lint
2. Unit tests
3. Deploy integration with Terraform and `flyctl deploy`
4. Run integration E2E
5. Deploy production with Terraform and `flyctl deploy`
6. Run production E2E

Do not describe this as a Render deployment flow unless the source files change.

## Adding Environment Variables

When app configuration changes, review all affected surfaces.

- Local `.env`
- GitHub Actions job env blocks if tests need the variable
- Fly secrets if the value is sensitive and required at runtime
- Terraform variables or tfvars only when the variable is actually part of infrastructure configuration

Do not force every app env var into Terraform if the repo currently sets it through Fly secrets in CI instead.

## Secret Handling

- `TF_API_TOKEN` and `FLY_API_TOKEN` belong in GitHub secrets or environment secrets
- App secrets such as auth and SMTP values are staged with `flyctl secrets set`
- Avoid committing real secret values to `.tfvars`

## Review Checklist

- The change matches Fly.io, not a different hosting provider
- Integration and production are both considered where relevant
- Terraform changes and CI changes stay in sync
- Sensitive values stay out of committed non-secret files
- Any new deploy-time app config is wired through the correct layer