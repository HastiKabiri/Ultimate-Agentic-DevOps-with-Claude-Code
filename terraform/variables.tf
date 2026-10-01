variable "region" {
  description = "AWS region for the S3 bucket and provider"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name, used for resource naming and the Project tag"
  type        = string
  default     = "portfolio-site"
}

variable "environment" {
  description = "Deployment environment, used for resource naming and the Environment tag"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Optional custom domain for the site (empty = use the CloudFront default domain). Not yet wired up: a custom domain also needs an ACM certificate in us-east-1."
  type        = string
  default     = ""
}
