# Remote state backend (S3) — intentionally commented out for the first run.
#
# Bootstrapping steps:
#   1. Run `terraform init` with this block commented out (state is stored locally).
#   2. Run `terraform apply` to create the resources.
#   3. Create (or choose) an S3 bucket for Terraform state — ideally a separate,
#      versioned, encrypted bucket, not the website bucket.
#   4. Uncomment the block below and fill in the bucket name.
#   5. Run `terraform init -migrate-state` to move the local state into S3.
#
# terraform {
#   backend "s3" {
#     bucket       = "<your-terraform-state-bucket>"
#     key          = "portfolio-site/production/terraform.tfstate"
#     region       = "ap-south-1"
#     encrypt      = true
#     use_lockfile = true # S3-native state locking (Terraform >= 1.10); use dynamodb_table on older versions
#   }
# }
