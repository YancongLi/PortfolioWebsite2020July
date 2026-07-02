# peterli.dev

Personal portfolio website. Plain HTML/CSS/JS — no build step — hosted on AWS S3.

- Live: https://peterli.dev

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | The whole site (single page) |
| `style.css` | Styles, light/dark themes via CSS custom properties |
| `script.js` | Theme toggle (follows OS preference, manual choice persisted) |
| `resume.pdf` | Current résumé (stable filename so links never break) |
| `images/profile.jpg` | Optimized profile photo |

## Deploy

Merging to `master` deploys automatically via GitHub Actions
(`.github/workflows/deploy.yml`), which syncs the repo to the S3 bucket and
deletes files that no longer exist locally.

### One-time setup

1. In the AWS console, create an IAM user (e.g. `github-deploy`) with no
   console access and attach this policy (least privilege for the bucket):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": "s3:ListBucket",
         "Resource": "arn:aws:s3:::peterli-personal"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
         "Resource": "arn:aws:s3:::peterli-personal/*"
       }
     ]
   }
   ```

2. Create an access key for that user (use case: "Third-party service").
3. In this repo: Settings → Secrets and variables → Actions → add
   `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

Until the secrets exist, the workflow fails fast with a clear message and
nothing is deployed. You can also trigger a deploy manually from the Actions
tab (`workflow_dispatch`), or keep deploying by hand:

```sh
aws s3 sync . s3://peterli-personal \
  --exclude ".git/*" --exclude ".github/*" \
  --exclude "README.md" --exclude "bucket-policy.txt" \
  --delete
```

`bucket-policy.txt` is the public-read bucket policy for reference.
