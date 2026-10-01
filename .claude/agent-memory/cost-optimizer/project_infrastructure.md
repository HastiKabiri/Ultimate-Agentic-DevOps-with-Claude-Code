---
name: portfolio-site-infrastructure
description: Static HTML/CSS portfolio site on AWS S3 + CloudFront; 10k page views/month, <50MB content; ~$0.22/month current cost
metadata:
  type: project
---

**Architecture:** Private S3 bucket + CloudFront (OAC, PriceClass_200, CachingOptimized, compress enabled) + GitHub Actions CI/CD deploying via `aws s3 sync --delete` + `/*` invalidation.

**Current Monthly Cost:** ~$0.22 (S3: ~$0.005, CloudFront: ~$0.17)

**Already Cost-Optimized:**
- PriceClass_200 (mandated by spec; removes only expensive Oceania)
- CachingOptimized policy with 1-year/1-day TTL
- Compression enabled
- Cache invalidation within free tier (<1k paths/month)
- Standard storage class appropriate for <50MB static files

**Security Audit Recommendations & Cost Impact:**
1. HTTPS-deny bucket policy: $0 cost, high security value
2. S3 versioning + 30-day noncurrent expiry: +$0.001/month, rollback safety
3. CloudFront access logging + 90-day expiry: +$0.001/month, audit trail
4. Remote Terraform state (S3 + S3-native locking): +$0.0001/month, reliability
5. S3 access logging: +$0.001/month, audit trail (lower priority)
6. WAF: ~$5/month — NOT recommended for low-traffic site

**Not Recommended:** WAF (~$5+/month too expensive); Intelligent-Tiering (unnecessary for <50MB static); changes to PriceClass (spec mandates PriceClass_200).
