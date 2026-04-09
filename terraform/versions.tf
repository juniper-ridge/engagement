terraform {
  required_version = "1.14.8"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.3"
    }
  }

  # Terraform Cloud manages state and remote execution.
  # Both workspaces (juniper-ridge-integration, juniper-ridge-production) must
  # have the tag "juniper-ridge" applied in the TF Cloud UI so that
  # TF_WORKSPACE can select between them at plan/apply time.
  cloud {
    organization = "juniper-ridge"

    workspaces {
      tags = ["juniper-ridge"]
    }
  }
}

provider "render" {
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}
