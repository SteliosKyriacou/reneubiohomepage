# SAISHO Website

Static marketing site for SAISHO, published at **https://www.saisho.ai**.

## Deployment

The site is hosted on **GitHub Pages**, served directly from the root of the
`main` branch. There is no build step. Pushing to `main` publishes it, and the
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
downloadable** at its path, including anything under `Deck/`. Do not commit
files you do not want on the open internet.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Main landing page |
| `test1/index.html` | Scratch page with a GCP iframe embed |
| `isomorphiclabs/index.html` | Client-side redirect to the AlphaForge demo host |
| `index.css` | Stylesheet for all pages |
| `main.js` | Animated background canvas and scroll reveals |
| `assets/` | Logos, team photos, and the social preview card |
| `Deck/` | Investor and partner documents (not linked from any page) |

`test1/index.html` is not linked from the site's navigation; it is reachable
only by direct URL.

`aged_biology.html` and `roi_model.html` were removed: they carried the older
discovery-platform framing that contradicted the rating-agency positioning.
Both URLs now return 404. They remain in history on the `saisho-prerating`
branch.

### Social preview

`index.html` carries Open Graph and Twitter card tags. `assets/social-card.png`
is the 1200x630 preview image; it is a raster file because LinkedIn, Slack and
X do not render SVG. If the headline on the home page changes, regenerate the
card so the two do not disagree.

### Redirects

GitHub Pages cannot issue server-side 301s, so redirects are static pages
that bounce the browser client-side (`location.replace()`, with a meta
refresh fallback and a manual link). `isomorphiclabs/index.html` sends
`/isomorphiclabs` to `http://34.169.179.175:4003/`. That target is a bare
IP served over plain HTTP, so the destination is not encrypted and the
link breaks if the instance IP changes.

### Logo

`assets/saisho-logo-black-bg.svg` is the pristine source asset, exactly as
supplied: black background intact, C2PA provenance manifest intact.

`assets/SAISHO-logo.svg` is the file the pages actually reference. It is the
same artwork with the opaque black background rectangle removed, so the mark
composites cleanly against the site's `#0a0f1e` background, and with the C2PA
manifest stripped (editing the file invalidates its signature, so a broken
manifest would be worse than none). Keep both.

The brand palette in `index.css` is derived from this logo's `#saishoGradient`
stops. If the logo is replaced again, update those `--logo-*` variables to
match, along with `--primary-rgb` and the `rgba()` values in `main.js`.

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
