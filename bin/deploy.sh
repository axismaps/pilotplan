npm run build
aws s3 sync dist/ s3://pilotplan.org --delete
aws cloudfront create-invalidation --distribution-id E1OA4SOYLJP856 --paths /\*