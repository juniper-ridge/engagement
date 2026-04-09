# ── Integration environment ─────────────────────────────────────────────────
# Sensitive variables (render_api_key, render_owner_id, auth_secret,
# admin_email, admin_password, smtp_host, smtp_user, smtp_password)
# are set in the Terraform Cloud workspace UI — never here.
# ────────────────────────────────────────────────────────────────────────────

service_name               = "juniper-ridge-integration"
plan                       = "starter"
region                     = "oregon"
branch                     = "develop"
repo_url                   = "https://github.com/YOUR_USERNAME/juniper-ridge-landscape" # TODO
nextauth_url               = "https://juniper-ridge-integration.onrender.com"
database_url               = "file:/data/dev.db"
smtp_port                  = "587"
smtp_from                  = ""
client_email               = ""
next_public_bookings_url   = ""
next_public_site_name      = "Juniper Ridge Landscape"
next_public_business_email = "info@juniperridgelandscape.com"
next_public_phone_number   = "(555) 867-5309"
next_public_phone_href     = "tel:+15558675309"
next_public_service_region = "Wasatch Front, Utah"
next_public_business_hours = "Mon–Fri: 9am–5pm"
next_public_domain         = "juniper-ridge-integration.onrender.com"
