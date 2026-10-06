// Generates manifest.json for the Iteration gallery. Run: node gen-manifest.mjs
//
// The gallery is exactly this list. Every ad is a self-contained page under animations/<id>/
// that plays <id>/final.mp4 (4:5, with sound), with a 4:5 poster beside it; its tile thumbnail
// is a capture at assets/shots/<id>.png and its lightbox download button points back at the
// same final.mp4, so the ad a viewer watches is the ad they download. Add an entry here only
// once the page, the film, the poster and the thumbnail are all on disk — the loop below skips
// (and names) any ad whose files are missing rather than shipping a dead tile or a 404 download.
import { existsSync, writeFileSync } from 'node:fs';

const ADS = [
  {
    id: 'knit-video_knitsocial_youtube_scan_v1',
    group: 'Ad spots',
    title: 'Knit: find your people.',
    desc: 'Reddit video ad (video_knitsocial_youtube_scan_v1) for Knit, campaign beta_knitsocial_youtube_scan_2610.',
    downloadLabel: 'MP4 4:5',
  },
];

const items = [];
const missing = [];
for (const ad of ADS) {
  const src = `animations/${ad.id}/`;
  const files = {
    src,
    thumb: `assets/shots/${ad.id}.png`,
    poster: `${src}poster.png`,
    page: `${src}index.html`,
    download: `${src}final.mp4`,
  };
  const gone = [files.page, files.download, files.poster, files.thumb].filter((f) => !existsSync(f));
  if (gone.length) {
    missing.push(...gone.map((f) => `${ad.id}: ${f}`));
    continue;
  }
  items.push({
    id: ad.id,
    type: 'animation',
    group: ad.group,
    title: ad.title,
    src: files.src,
    thumb: files.thumb,
    download: files.download,
    downloadLabel: ad.downloadLabel,
    desc: ad.desc,
  });
}

writeFileSync('manifest.json', JSON.stringify(items, null, 2) + '\n');
console.log(`manifest.json: ${items.length} item(s)`);

if (missing.length) {
  console.log(`\nWARNING: skipped ${missing.length} file(s) for ads that are not complete on disk:`);
  for (const m of missing) console.log(`  ${m}`);
}