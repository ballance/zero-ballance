#!/bin/bash

set -e

echo "🚀 Starting deployment to zeroballance.bastionforge.com"

# Build the web version
echo "📦 Building web version..."
npm run build:web

# Check if web-build directory exists and has files
if [ ! -d "web-build" ] || [ -z "$(ls -A web-build)" ]; then
    echo "❌ Error: web-build directory is empty or doesn't exist"
    exit 1
fi

echo "✅ Web build completed"

# Get the S3 bucket name from Terraform output
echo "🔍 Getting S3 bucket name from Terraform..."
cd terraform
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
CLOUDFRONT_ID=$(terraform output -raw cloudfront_distribution_id)
cd ..

if [ -z "$BUCKET_NAME" ]; then
    echo "❌ Error: Could not get S3 bucket name from Terraform output"
    echo "Make sure you have run 'terraform apply' first"
    exit 1
fi

echo "📤 Uploading files to S3 bucket: $BUCKET_NAME"

# Sync files to S3
aws s3 sync web-build/ s3://$BUCKET_NAME --delete --exact-timestamps

echo "✅ Files uploaded to S3"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"

echo "✅ CloudFront cache invalidated"
echo "🎉 Deployment completed! Your site should be available at https://zeroballance.bastionforge.com"