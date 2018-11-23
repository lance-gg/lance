#!/bin/bash
source /home/ec2-user/.bash_profile
mkdir -p /var/games/lance
cd /var/games/lance
npm install
npm run docs


# upload static files to s3
cd /var/games/lance/docs_out && aws s3 sync --acl public-read --delete . s3://docs.lance.gg

# invalidate CDN
aws configure set preview.cloudfront true && aws cloudfront create-invalidation --distribution-id EZZ6SM0QWM7CC --paths "/*"
