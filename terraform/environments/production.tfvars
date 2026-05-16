# ── Production environment ──────────────────────────────────────────────────
# Sensitive variables (fly_api_token, auth_secret, admin_email,
# admin_password, smtp_host, smtp_user, smtp_password) are injected by
# GitHub Actions as TF_VAR_* env vars — never put them here.
# Non-sensitive env vars (NEXT_PUBLIC_*, SMTP_PORT, etc.) live in
# fly.toml and are set on the app by flyctl deploy.
# ────────────────────────────────────────────────────────────────────────────

app_name = "juniper-ridge"
org_slug = "personal"
region   = "sea"
