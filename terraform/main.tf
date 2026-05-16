# Creates the Fly.io application shell.
# Actual deployment (Docker image + machine) is handled by flyctl in CI.
resource "fly_app" "app" {
  name = var.app_name
  org  = var.org_slug
}

# Persistent 1 GB volume for the SQLite database file (mounted at /data).
# If you switch to PostgreSQL, remove this resource and update fly.toml.
resource "fly_volume" "data" {
  app    = fly_app.app.name
  name   = "data"
  size   = 1
  region = var.region

  depends_on = [fly_app.app]
}
