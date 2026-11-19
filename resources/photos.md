# The photos: how they are kept and the procedure used

This note records how the pictures of the blog are stored, how the photos that were hotlinked from imgur were moved
onto the site (November 2026), and how to add a new photo. The note is in git; the original photos next to it are not.

## Where things are

| What | Where | In git |
| --- | --- | --- |
| The pictures of the site | `static/images/...` (also mounted as `assets/images`, see `hugo.toml`) | yes |
| The photos that came from imgur, shrunk | `static/images/photos/<imgur id>.jpg` (or `.png`, `.mp4`) | yes (61 MB) |
| The **original** photos, as imgur served them | `resources/photos/<imgur id>.<ext>` (178 files, 255 MB) | **no** (`.gitignore`) |
| The Hugo cache of the resized copies | `resources/_gen` | no |
| This note | `resources/photos.md` | yes (`.gitignore` has `!resources/photos.md`) |

The originals are kept only as a backup. No page uses them. If the folder is lost, imgur still has them, except the
eleven that it deleted (see below).

## Why they were moved

- 178 pictures were hotlinked from imgur and averaged 1.4 MB each (full phone photos shown at 900 px). One post had 21 of
  them, about 40 MB for one visit.
- Imgur can remove a picture, limit hotlinking or change its rules. Eleven pictures of the post
  `2024/24_12_25_windows_1_0_install.md` were already deleted.
- Hugo can only make small copies of pictures that are on the site.

Result: 255 MB of originals became 61 MB of copies, and a post such as Restoration Part 1 now sends about 2.7 MB of pictures.

## The procedure that was used

All commands run from the root of the repository. The working folder was outside the repository; the originals now live
in `resources/photos`.

### 1. List the imgur links

```sh
rg -o -N --no-filename 'https?://(i\.)?imgur\.com/[A-Za-z0-9]+\.[A-Za-z0-9]+' content \
  | sed -E 's#^http://#https://#; s#https://imgur\.com/#https://i.imgur.com/#' | sort -u > urls.txt
```

There were 178 different links: 93 `.jpg`, 62 `.jpeg`, 22 `.png` and one `.mp4`.

### 2. Download them (six at a time)

```sh
#!/usr/bin/env bash
# dl.sh URL: download one imgur picture into orig/
url="$1"; dest="orig/$(basename "$url")"
[ -s "$dest" ] && exit 0
code=$(curl -sS -L -A 'Mozilla/5.0 (X11; Linux x86_64)' -m 90 --retry 2 -o "$dest" -w '%{http_code}' "$url")
[ "$code" = 200 ] && [ -s "$dest" ] || { echo "FAIL $url http=$code"; rm -f "$dest"; }
```

```sh
mkdir -p orig && xargs -P 6 -I{} ./dl.sh {} < urls.txt
```

All 178 downloaded; they are now in `resources/photos`.

### 3. Find the pictures that imgur has deleted

For a deleted picture, imgur does not answer with an error. It sends a small "removed" picture: a PNG of 161x81 pixels
and 503 bytes, MD5 `d835884373f4d6c8f24742ceabe74946`. Check every download against it:

```sh
md5sum resources/photos/*.png | rg d835884373f4d6c8
```

Eleven were removed: `5lJfwJH AvtdDGC EEIK9fe MrZjPwv OEeQmi5 R0sHQ0j RheEeKN Xxdyaoe dekRsSC lPKpfYl x7RDC7u` (all in the
Windows 1.0 post). They were not copied to `static`, and their links were left as they were. If you find the real
pictures, save them as `static/images/photos/<id>.jpg` and change the links. (Their placeholder files are in
`resources/photos` like all the others.)

### 4. Shrink

Rules: at most 1600 px wide (never enlarge), remove the metadata, keep the orientation of the camera (`-auto-orient`),
JPEG quality 82, progressive. The 1600 px width is the largest copy that a page offers.

```sh
mkdir -p static/images/photos
for f in resources/photos/*; do
  name="$(basename "$f")"; id="${name%.*}"; ext="${name##*.}"
  case "${ext,,}" in
    jpg|jpeg) convert "$f" -auto-orient -resize '1600x>' -strip -interlace Plane -sampling-factor 4:2:0 -quality 82 "static/images/photos/$id.jpg" ;;
    png)      convert "$f" -auto-orient -resize '1600x>' -strip -define png:compression-level=9 "static/images/photos/$id.png" ;;
    mp4)      cp "$f" "static/images/photos/$id.mp4" ;;
  esac
done
```

A PNG that is a photo is far bigger than a JPEG. Each PNG was also converted to JPEG, and the JPEG was used when it was
**less than half the size** of the PNG (a screenshot or a drawing stays PNG). 10 of the 11 real PNGs became JPEG; only
`wFs5ybp.png` (a small picture of 523x310) stayed PNG. Then the deleted pictures from step 3 were removed from
`static/images/photos`. The folder has 165 JPEG, 1 PNG and 1 MP4 (the Qume terminal video).

### 5. Rewrite the links in the posts

```python
import pathlib, re
photos = {p.stem: p.name for p in pathlib.Path('static/images/photos').iterdir()}
pat = re.compile(r'https?://(?:i\.)?imgur\.com/([A-Za-z0-9]+)\.([A-Za-z0-9]+)')
for f in pathlib.Path('content').rglob('*.md'):
    t = f.read_text(encoding='utf-8')
    n = pat.sub(lambda m: '/images/photos/' + photos[m.group(1)] if m.group(1) in photos else m.group(0), t)
    if n != t: f.write_text(n, encoding='utf-8')
```

173 links in 25 posts were changed. A link whose id is not in `static/images/photos` (the eleven deleted ones) is left alone.

### 6. Check

```sh
hugo --minify -d /tmp/site          # no errors; the first build takes about two minutes
rg -o -N 'imgur\.com/[A-Za-z0-9]+\.[a-z0-9]+' content   # only the eleven deleted ones should remain
```

## Adding a new photo from now on

1. Shrink it first. Never commit a camera original (2 to 5 MB):
   ```sh
   convert IMG_1234.jpeg -auto-orient -resize '1600x>' -strip -interlace Plane -sampling-factor 4:2:0 -quality 82 static/images/photos/short-name.jpg
   ```
   Keep the original somewhere outside git, for example `resources/photos/`.
2. Use it in a post with a real description:
   `![The case open, with the drive assembly removed.](/images/photos/short-name.jpg)`
   - A description of **four words or more** is shown as a caption under the picture. A shorter one is only the alt text.
   - Do not link to imgur or to another site: the site cannot resize those pictures, and they can disappear.
3. The first image of a post is its thumbnail on the home page and in the search. To choose another, set
   `image = "/images/photos/other.jpg"` in the front matter. A post with no image gets `/images/default-thumb.png`.

How a picture is shown (`layouts/_default/_markup/render-image.html`): lazy loading, the width and height of the picture
(so the text does not jump), an 800 px and a 1600 px WebP copy that the browser chooses from (made by Hugo, cached in
`resources/_gen`), and click to enlarge (`assets/js/zoom.js`). GIFs and pictures from other sites are shown as they are.
The thumbnails (`layouts/partials/post-thumb-*.html`) are made at build time.

## GitHub limits (checked in the GitHub documentation, November 2026)

- A published Pages site: at most 1 GB (it was 145 MB; pictures 122 MB).
- A repository: ideally under 1 GB; a file over 50 MiB gives a warning and over 100 MiB is blocked.
- Bandwidth of a site: soft limit of 100 GB a month. The 10 builds an hour limit does not apply to a workflow.
- Git keeps every committed picture for ever. Commit shrunk copies only.

## Unused pictures (kept on purpose)

40 unused of 570 pictures, 23.9 MB (checked on November 19, 2026). Nothing was deleted. The list is in the order of size:

- `images/misc/10-05-2024_11-36-57.gif` (10.67 MB)
- `images/misc/10-05-2024_11-34-41.mp4` (10.37 MB)
- `images/misc/10-05-2024_11-35-07.gif` (1.32 MB)
- `images/Electronics/24lcxx_4.jpg` (0.21 MB)
- `images/unsorted/linux_cd_yggdrasil_1993.gif` (0.12 MB)
- `images/Sharepoint/cartel25deEnero.jpg` (0.11 MB)
- `images/Sharepoint/cartel_2025_20de_20enero_20web.jpg` (0.11 MB)
- `images/unsorted/old-software-3-microsoft-vc.jpg` (0.10 MB)
- `images/unsorted/old-software-4-os2.jpg` (0.10 MB)
- `images/unsorted/old-software-1.jpg` (0.09 MB)
- `images/unsorted/old-software-2-novell311.jpg` (0.08 MB)
- `images/Sharepoint/mjavier2.gif` (0.06 MB)
- `images/Electronics/24lcxx.jpg` (0.05 MB)
- `images/Sharepoint/librosSharePoint2.gif` (0.04 MB)
- `images/Electronics/24lcxx_2.jpg` (0.04 MB)
- `images/Electronics/24lcxx_3.jpg` (0.04 MB)
- `images/Sharepoint/mjavier.gif` (0.04 MB)
- `images/unsorted/ida.png` (0.04 MB)
- `images/unsorted/clipper/code2.png` (0.04 MB)
- `images/unsorted/TD1.png` (0.03 MB)
- `images/unsorted/clipper/defrag2.png` (0.03 MB)
- `images/unsorted/clipper/cames4.png` (0.02 MB)
- `images/Sharepoint/openday-3.jpg` (0.02 MB)
- `images/unsorted/clipper/cames5.png` (0.02 MB)
- `images/unsorted/clipper/tutti.png` (0.02 MB)
- `images/unsorted/clipper/conta4.png` (0.02 MB)
- `images/Sharepoint/YACAMLQT_camlnet.gif` (0.01 MB)
- `images/unsorted/clipper/multibase1.png` (0.01 MB)
- `images/Sharepoint/CCP2_Rename.gif` (0.01 MB)
- `images/Electronics/24lcxx_1.jpg` (0.01 MB)
- `images/Sharepoint/excel_tabla_dinamica.gif` (0.01 MB)
- `images/Sharepoint/summit2007_microsoft.jpg` (0.00 MB)
- `images/Sharepoint/summit2007_llmc.jpg` (0.00 MB)
- `images/Sharepoint/excel_csegOLAP.gif` (0.00 MB)
- `images/Sharepoint/summit2007_party.jpg` (0.00 MB)
- `images/Sharepoint/SPSRollUpTree_Beta.gif` (0.00 MB)
- `images/Sharepoint/summit2007_currando.jpg` (0.00 MB)
- `images/Sharepoint/summit2007_keynote.jpg` (0.00 MB)
- `images/Sharepoint/summit2007_karaoke.jpg` (0.00 MB)
- `images/Palm/simple-smile.png` (0.00 MB)

To list them again (a picture counts as used when its path appears in a post, a layout, the CSS or `hugo.toml`):

```sh
python3 - <<'EOF'
import pathlib, urllib.parse
static = pathlib.Path('static')
files = {str(p.relative_to(static)): p for p in (static/'images').rglob('*') if p.is_file() and p.suffix.lower() in ('.gif','.jpg','.jpeg','.png','.mp4','.webp')}
sources = list(pathlib.Path('content').rglob('*.md')) + list(pathlib.Path('layouts').rglob('*.html')) + [pathlib.Path('hugo.toml'), pathlib.Path('assets/css/custom.css'), pathlib.Path('assets/js/zoom.js')]
text = urllib.parse.unquote(urllib.parse.unquote(''.join(f.read_text(encoding='utf-8', errors='replace').lower() + '\n' for f in sources)))
for k, p in sorted(files.items(), key=lambda x: -x[1].stat().st_size):
    if k.lower() not in text:
        print('%6.2f MB  %s' % (p.stat().st_size / 1048576, k))
EOF
```

Broken picture links that were fixed with an unused file: `Sharepoint/PickerVideo.gif` (the post had `ADPiPickerVideo.gif`) and
`Sharepoint/SPSRollUp_TipImages.gif` (the post had `SPSRollUpTipImages.gif`). Two links still have no file: see `TODO.md`.
