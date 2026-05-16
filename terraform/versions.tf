terraform {
  required_version = "1.14.8"

  required_providers {
    fly = {
      source  = "fly-apps/fly"
      version = "~> 0.0.23"
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

provider "fly" {
  fly_api_token = var.fly_api_token
}
