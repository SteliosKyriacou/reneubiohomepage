# SAISHO Website

Static marketing site for SAISHO, published at **https://www.saisho.ai**.

## Deployment

The site is hosted on **GitHub Pages**, served directly from the root of the
`main` branch. There is no build step — pushing to `main` publishes it, and the
new version is usually live within a minute or two.

The **`CNAME`** file binds the custom domain. GitHub Pages supports exactly one
custom domain per repository, so that file holds a single hostname:

```
www.saisho.ai
```

Deleting or changing `CNAME` will take the domain down, so leave it alone unless
you are deliberately moving the site. DNS for `saisho.ai` lives at GoDaddy, where
a `www` CNAME record points to `stelioskyriacou.github.io`.

Because Pages serves the repository root, **every tracked file is publicly
downloadable** at its path — including anything under `Deck/`. Do not commit
files you do not want on the open internet.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main landing page |
| `aged_biology.html` | The Aged Biology Edge page, linked from the nav |
| `roi_model.html` | AlphaForge Impact Model calculator (uses `model.js`) |
| `test1/index.html` | Scratch page with a GCP iframe embed |
| `index.css` | Stylesheet for all pages |
| `main.js` | Animated background canvas and scroll reveals |
| `model.js` | ROI calculator logic |
| `assets/` | Logos, platform imagery, and team photos |
| `Deck/` | Investor and partner documents (not linked from any page) |

`roi_model.html` and `test1/index.html` are not linked from the site's
navigation — they are reachable only by direct URL.

### Logo

`assets/SAISHO-logo.svg` is the file the pages actually use. It is identical to
`assets/SAISHO-logo-black-background.svg` except that the opaque black
background rectangle has been removed, so the mark composites cleanly against
the site's `#0a0f1e` background. Keep both: the black-background version is the
original source asset.

## Local preview

The pages use relative asset paths, so open them through a web server rather
than the filesystem:

```bash
python3 -m http.server 3000
```

Then visit http://localhost:3000.

## Branches

`main` is what gets published. Snapshot branches (`saisho0`, `saisho2`, `V0`,
`V1`) are point-in-time backups and are not deployed.
