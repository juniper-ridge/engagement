# ── Non-sensitive — safe to commit in environment tfvars ──────────────────

variable "service_name" {
  description = "Render web service name (must be globally unique on Render)"
  type        = string
}

variable "plan" {
  description = "Render service plan: starter | standard | pro"
  type        = string
  default     = "starter"
}

variable "region" {
  description = "Render deployment region: oregon | ohio | virginia | frankfurt | singapore"
  type        = string
  default     = "oregon"
}

variable "branch" {
  description = "Git branch to deploy from"
  type        = string
}

variable "repo_url" {
  description = "Full HTTPS URL of the GitHub repository"
  type        = string
}

variable "nextauth_url" {
  description = "Public base URL of the deployed app (NEXTAUTH_URL / AUTH_URL)"
  type        = string
}

variable "database_url" {
  description = "SQLite path (file:/data/dev.db) or PostgreSQL connection string"
  type        = string
  default     = "file:/data/dev.db"
}

variable "smtp_port" {
  description = "SMTP port (usually 587 for TLS or 465 for SSL)"
  type        = string
  default     = "587"
}

variable "smtp_from" {
  description = "From address for outgoing emails (e.g. noreply@yourdomain.com)"
  type        = string
  default     = ""
}

variable "client_email" {
  description = "Business email that receives contact form submissions"
  type        = string
  default     = ""
}

variable "next_public_bookings_url" {
  description = "Microsoft Bookings or appointment scheduling URL"
  type        = string
  default     = ""
}

variable "next_public_site_name" {
  description = "Full business name shown on site and in emails (e.g. Juniper Ridge Landscape)"
  type        = string
  default     = ""
}

variable "next_public_business_email" {
  description = "Business email address displayed publicly on the site"
  type        = string
  default     = ""
}

variable "next_public_phone_number" {
  description = "Business phone number displayed on site (e.g. (555) 867-5309)"
  type        = string
  default     = ""
}

variable "next_public_phone_href" {
  description = "Business phone tel: URI for click-to-call (e.g. tel:+15558675309)"
  type        = string
  default     = ""
}

variable "next_public_service_region" {
  description = "Geographic service area displayed on site (e.g. Wasatch Front, Utah)"
  type        = string
  default     = ""
}

variable "next_public_business_hours" {
  description = "Business hours displayed on contact page (e.g. Mon–Fri: 9am–5pm)"
  type        = string
  default     = ""
}

variable "next_public_domain" {
  description = "Public domain name used in email footers (e.g. juniperridgelandscape.com)"
  type        = string
  default     = ""
}

# ── Sensitive — NEVER put in tfvars ──────────────────────────────────────
# These are injected by GitHub Actions as TF_VAR_* environment variables,
# sourced from GitHub environment secrets (Settings → Environments →
# integration / production). No manual TF Cloud workspace configuration needed.

variable "render_api_key" {
  description = "Render API key — injected via TF_VAR_render_api_key in GitHub Actions"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render owner/team ID — injected via TF_VAR_render_owner_id in GitHub Actions"
  type        = string
  sensitive   = true
}

variable "auth_secret" {
  description = "AUTH_SECRET for NextAuth v5 JWT signing (min 32 chars) — injected via TF_VAR_auth_secret"
  type        = string
  sensitive   = true
}

variable "admin_email" {
  description = "Seed admin email — injected via TF_VAR_admin_email"
  type        = string
  sensitive   = true
}

variable "admin_password" {
  description = "Seed admin password — injected via TF_VAR_admin_password"
  type        = string
  sensitive   = true
}

variable "smtp_host" {
  description = "SMTP hostname — injected via TF_VAR_smtp_host"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_user" {
  description = "SMTP username — injected via TF_VAR_smtp_user"
  type        = string
  sensitive   = true
  default     = ""
}

variable "smtp_password" {
  description = "SMTP password — injected via TF_VAR_smtp_password"
  type        = string
  sensitive   = true
  default     = ""
}
