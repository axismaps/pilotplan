npm run build
aws s3 sync dist/ s3://pilotplan.axismaps.com --delete
# aws cloudfront create-invalidation --distribution-id EXJ4VM8AU5FRR --paths /\*