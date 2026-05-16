# ── Infrastructure variables — safe to commit in environment tfvars ──────────

variable "app_name" {
  description = "Fly.io application name (must be globally unique on Fly.io)"
  type        = string
}

variable "org_slug" {
  description = "Fly.io organization slug ('personal' for individual accounts)"
  type        = string
  default     = "personal"
}

variable "region" {
  description = "Fly.io primary deployment region (e.g. sea, sjc, iad, ord)"
  type        = string
  default     = "sea"
}

# ── Sensitive — NEVER put in tfvars ──────────────────────────────────────────
# Injected by GitHub Actions as TF_VAR_* environment variables,
# sourced from GitHub environment secrets (Settings → Environments →
# integration / production).

variable "fly_api_token" {
  description = "Fly.io API token — injected via TF_VAR_fly_api_token"
  type        = string
  sensitive   = true
}
