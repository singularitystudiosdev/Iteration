# Iteration — ad gallery

Every ad creative for **Iteration**, in one shareable page. Click the tile to zoom in or watch
the animation play live. Static — no build, no deps, no server: `index.html` reads
`manifest.json` and renders the grid.

**Live:** https://singularitystudiosdev.github.io/Iteration/

## Contents

1 ad spot:

- **Knit: find your people.** — the Reddit video ad
  (`video_knitsocial_youtube_scan_v1`) for Knit, campaign `beta_knitsocial_youtube_scan_2610`,
  destination https://knitsocial.net/. 18 s loop, 4:5, with sound.
  `animations/knit-video_knitsocial_youtube_scan_v1/`.

## Structure

```
index.html          gallery page (grid + lightbox)
gallery.js          data fetch + grid + lightbox (vanilla, no deps)
styles.css          dark textmode theme
soon.js             optional "coming soon" card spliced in before an ad
manifest.json       item list (generated)
gen-manifest.mjs    regenerates manifest.json (node gen-manifest.mjs)
animations/         each ad page, self-contained, served as-is
assets/shots/       ad thumbnails (playwright captures)
assets/             shared ar.js / ar.css and the superbot-UI chrome the pages borrow
```

Each ad folder holds `index.html` (the player), `final.mp4` (the film, 4:5, with sound) and
`poster.png` (its 4:5 poster). The gallery loads the folder in the lightbox with the ratios in
the top-left picker; the page plays `final.mp4` for every ratio, and the download button hands
back that same file.

## Adding an ad

1. `mkdir animations/<id>/` and drop in `index.html`, `final.mp4`, `poster.png`
   (copy an existing `index.html` — it autoplays muted-then-unmuted, loops, and unmutes on the
   viewer's first click/key/touch or on the gallery's `{ type: "unmute" }` message).
2. Capture a thumbnail: `npx playwright screenshot --viewport-size "1280,720" --wait-for-timeout 4500 <url> assets/shots/<id>.png`, and pick the better-looking frame.
3. Add the ad to `ADS` in `gen-manifest.mjs`, then `node gen-manifest.mjs`.

`gen-manifest.mjs` skips and names any ad whose page, film, poster or thumbnail is not on disk,
so a half-landed ad never ships a broken tile or a 404 download.

## Deploying

`.github/workflows/pages.yml` publishes the repo to GitHub Pages from an artifact: it checks
out one commit, stages the site without `.git` or `.github`, uploads it and deploys. Pages'
source must be set to **GitHub Actions** (not "Deploy from a branch"), and the repo is pushed
to `main`.

## License

MIT