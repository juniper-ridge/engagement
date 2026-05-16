output "app_name" {
  description = "Fly.io application name"
  value       = fly_app.app.name
}

output "app_hostname" {
  description = "Default Fly.io hostname"
  value       = "${fly_app.app.name}.fly.dev"
}
