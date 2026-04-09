resource "render_web_service" "app" {
  name   = var.service_name
  plan   = var.plan
  region = var.region

  # Prisma migrations run on every deploy before the server starts
  start_command = "npx prisma migrate deploy && npm start"

  runtime_source = {
    native_runtime = {
      # Deployments are triggered by GitHub Actions (not Render's auto-deploy)
      auto_deploy   = false
      branch        = var.branch
      build_command = "npm ci && npx prisma generate && npm run build"
      repo_url      = var.repo_url
      runtime       = "node"
    }
  }

  # Environment variables ─────────────────────────────────────────────────
  # Add new env vars here AND in variables.tf AND in both environment tfvars
  # (or as sensitive workspace variables in Terraform Cloud for secrets).
  env_vars = {
    NODE_ENV = {
      value = "production"
    }
    DATABASE_URL = {
      value = var.database_url
    }
    AUTH_SECRET = {
      value = var.auth_secret
    }
    # NextAuth v4 compat alias — keep until fully on v5
    NEXTAUTH_SECRET = {
      value = var.auth_secret
    }
    NEXTAUTH_URL = {
      value = var.nextauth_url
    }
    ADMIN_EMAIL = {
      value = var.admin_email
    }
    ADMIN_PASSWORD = {
      value = var.admin_password
    }
    SMTP_HOST = {
      value = var.smtp_host
    }
    SMTP_PORT = {
      value = var.smtp_port
    }
    SMTP_USER = {
      value = var.smtp_user
    }
    SMTP_PASSWORD = {
      value = var.smtp_password
    }
    SMTP_FROM = {
      value = var.smtp_from
    }
    CLIENT_EMAIL = {
      value = var.client_email
    }
    NEXT_PUBLIC_BOOKINGS_URL = {
      value = var.next_public_bookings_url
    }
    NEXT_PUBLIC_SITE_NAME = {
      value = var.next_public_site_name
    }
    NEXT_PUBLIC_BUSINESS_EMAIL = {
      value = var.next_public_business_email
    }
    NEXT_PUBLIC_PHONE_NUMBER = {
      value = var.next_public_phone_number
    }
    NEXT_PUBLIC_PHONE_HREF = {
      value = var.next_public_phone_href
    }
    NEXT_PUBLIC_SERVICE_REGION = {
      value = var.next_public_service_region
    }
    NEXT_PUBLIC_BUSINESS_HOURS = {
      value = var.next_public_business_hours
    }
    NEXT_PUBLIC_DOMAIN = {
      value = var.next_public_domain
    }
  }

  # Persistent disk for SQLite database file
  # If you switch to PostgreSQL, remove this block and update database_url.
  disk = {
    name       = "${var.service_name}-data"
    size_gb    = 1
    mount_path = "/data"
  }
}
