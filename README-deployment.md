# Deployment Guide for Zero Ballance Web App

This guide explains how to deploy the Zero Ballance web app to `zeroballance.bastionforge.com` using AWS S3 static hosting and CloudFront distribution.

## Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Terraform installed** (>= 1.0)
3. **Route 53 hosted zone** for `bastionforge.com` already set up
4. **Node.js** installed for building the web app

## Required AWS Permissions

Your AWS user/role needs permissions for:
- S3 (create buckets, manage objects)
- CloudFront (create distributions, invalidations)
- ACM (create certificates)
- Route 53 (manage DNS records)

## Setup Instructions

### 1. Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and update:
- `hosted_zone_id`: Your Route 53 hosted zone ID for bastionforge.com

### 2. Initialize and Deploy Infrastructure

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

This will create:
- S3 bucket for static hosting
- CloudFront distribution with SSL certificate
- Route 53 DNS records
- ACM certificate with automatic validation

### 3. Deploy the Web App

From the project root:

```bash
./deploy.sh
```

This script will:
1. Build the web version using webpack
2. Upload files to the S3 bucket
3. Invalidate CloudFront cache

## Manual Deployment Steps

If you prefer to deploy manually:

```bash
# Build the web app
npm run build:web

# Get bucket name from Terraform
cd terraform
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
cd ..

# Upload to S3
aws s3 sync web-build/ s3://$BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
```

## Project Structure

```
terraform/
├── main.tf              # Provider configuration
├── variables.tf         # Input variables
├── s3.tf               # S3 bucket configuration
├── cloudfront.tf       # CloudFront distribution
├── acm.tf              # SSL certificate
├── route53.tf          # DNS records
├── outputs.tf          # Output values
└── terraform.tfvars    # Your configuration values

web-build/              # Built web app (generated)
├── index.html
├── bundle.js
└── bundle.js.LICENSE.txt

deploy.sh               # Deployment script
```

## Updating the Site

To update the deployed site:

1. Make your changes to the React Native/web code
2. Run `./deploy.sh` to build and deploy

## Cleanup

To destroy all AWS resources:

```bash
cd terraform
terraform destroy
```

## Troubleshooting

- **Certificate validation hanging**: Make sure the hosted zone ID is correct
- **403 errors**: Check S3 bucket policy and CloudFront OAC configuration
- **DNS not resolving**: Wait a few minutes for DNS propagation
- **Build errors**: Make sure you have all dependencies installed with `npm install`