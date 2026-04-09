output "service_url" {
  description = "Public URL of the deployed Render service"
  value       = "https://${render_web_service.app.name}.onrender.com"
}

output "service_id" {
  description = "Render internal service ID"
  value       = render_web_service.app.id
}
