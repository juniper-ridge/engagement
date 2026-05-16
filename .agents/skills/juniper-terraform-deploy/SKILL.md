---
name: juniper-terraform-deploy
description: Juniper Ridge deployment patterns for Terraform Cloud, Fly.io app provisioning, CI rollout flow, and environment variable wiring.
user-invocable: false
---

# Juniper Terraform Deploy

Use this skill when editing deployment infrastructure, CI rollout steps, Terraform variables, Fly.io settings, or environment variable propagation.

## Apply This Skill For

- Editing files under `terraform/`
- Updating `.github/workflows/ci.yml`
- Changing Fly app names, regions, or deploy configs
- Adding new environment variables used by the app or pipeline
- Reviewing whether deployment changes match the checked-in infrastructure

## References

See [fly-terraform-ci.md](./fly-terraform-ci.md) for:
- Current Terraform and Fly.io responsibilities
- CI deployment sequence
- Env var and secret wiring checklist
- Notes about stale instructions versus source of truth