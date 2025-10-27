# Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages. Here's how it works:

## Automatic Deployment

The project uses GitHub Actions for automatic deployment. When you push changes to the `main` branch, the following happens:

1. GitHub Actions runs the workflow defined in `.github/workflows/deploy.yml`
2. It sets up a Node.js environment
3. It installs dependencies with `npm install`
4. It builds the project with `npm run build`
5. It deploys the built files to the `gh-pages` branch
6. GitHub Pages serves the site from the `gh-pages` branch

## Manual Deployment

If you need to deploy manually, you can run:

```bash
npm run deploy
```

This command will:
- Build the project with `vite build`
- Create a `.nojekyll` file in the dist folder (to enable Vue Router's history mode)
- Create a CNAME file for custom domain (if needed)

## Configuration Notes

- The `base` option in `vite.config.js` is set to `/promo/` to match the repository name
- The GitHub Actions workflow uses the `peaceiris/actions-gh-pages` action to handle deployment
- The site will be available at `https://BlackHoleSoft.github.io/promo/`

## Troubleshooting

If your site doesn't appear or routing doesn't work:

1. Check that GitHub Pages is enabled in your repository settings
2. Make sure the `base` option in `vite.config.js` matches your repository name
3. Verify that the `gh-pages` branch is being created and updated after pushes to main
