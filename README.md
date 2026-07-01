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

```sh
aws s3 sync . s3://YOUR-BUCKET-NAME \
  --exclude ".git/*" --exclude "bucket-policy.txt" --exclude "README.md" \
  --delete
```

`bucket-policy.txt` is the public-read bucket policy for reference.
