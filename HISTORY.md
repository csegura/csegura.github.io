## 2026-10-25

- Switch the poison submodule URL to HTTPS so CI and fresh clones need no SSH key.
- Set the real `baseURL` so the sitemap and RSS use absolute URLs.
- Override the theme meta partial: the theme left post descriptions empty and wrote a relative `og:image`. Posts now use the first paragraph.
- Remove placeholder socials, duplicate Disqus keys and unused Sass and Node steps (the build passes without them).
- Add `robots.txt` with the sitemap URL.

- Fix two posts that started with a blank line before `+++`; Hugo ignored their front matter.
- Rename three `... copy.md` posts and add `aliases` so the old `-copy` URLs still work.
- Correct three post dates whose year did not match the file name and folder (the file name year is the source of truth).
- Fix 26 image paths with wrong case or extension; Linux hosting is case-sensitive. The `csegXBrain%25204/5` links now point to `csegXBrain_204/205`, which is a guess.
- Normalize tags: lowercase, merge `webpart` into `webparts` and `disk` into `disks`, so tag pages do not split. Add tags to seven untagged posts.

- Add a 1200x630 social image (`assets/og-image.png`) as the default `og_image`; the 460x460 avatar looked poor when shared.
- Add JSON-LD in the meta partial override: `BlogPosting` for posts, `WebSite` for the home page, so search engines get dates, keywords and image.
- Add `description` to the four NorthStar posts; the first paragraph is only a fallback.

- Update the workflow actions (checkout v7, configure-pages v6, upload-pages-artifact v5, deploy-pages v5) to remove the Node.js 20 deprecation warnings.
- Show a thumbnail next to each post on the front page (`layouts/index.html`, `assets/css/custom.css`): the `image` front matter, else the first image in the post.
- Add an "Other sites" menu section with an external link to asm.romheat.net.
- Style the sidebar "Recent" label as a section label (uppercase, smaller, lighter) so it no longer looks like a disabled link.
- Reorder the sidebar menu (About, Other sites, Posts, Tags) and compact it on desktop (smaller avatar, one-line recent titles, no horizontal overflow) so the whole menu fits without scrolling.
- Add Giscus comments (GitHub Discussions, category Announcements) on posts through a `layouts/partials/post/comments.html` override; a post can opt out with `comments = false`.
- Add an EMUX86 external link under ASM in the "Other sites" menu.
- Add two articles about the emu_x86 emulator (`26_11_15_emu_x86_part_1_*`, `part_2_*`) with six project screenshots in `static/images/emu_x86/`. The source repository is private, so the articles link only to the public demo and the emu_x86-disks repository.
- Rewrite the emu_x86 articles after the project docs changed: Part 1 (using the emulator), Part 2 (disk manager, debugger, network, Linux window, emuctl) and a new Part 3 (inside the emulator). Parts 1 and 2 keep their addresses.
- Update the emu_x86 articles to the changed project docs: speed and RAM labels, formatted disk types, watch memory, and the ISA card for DOS and Windows 95.
- Add three articles about the NorthStar Advantage emulator emu_ns, dated 2026-11-01, 07 and 08, with three screenshots in `static/images/northstar_emulator/`. The source repository is private, so they link only to the demo, the public disk images and the restoration posts.
- Add a photo of the ESP32 prototype (resized to 1600 px) to part 3 of the NorthStar emulator articles.
- Add an article about rmtdos 0.2 (a fork of rmtdos by Dennis Jenkins), dated 2026-08-30, with six screenshots in `static/images/rmtdos/`. It says that the fork is not public and was tested only on emulated PCs.
- Add a second article of 2026-08-30 about the rmtdos protocol (V1, the V1 server optimisations of February 2026, and V2); the two rmtdos articles carry times so that the overview is listed first.
- Order multi-part articles newest first (last part on top): the emu_x86 parts and the two rmtdos articles got times in that order. I had set them the other way before.
- Redesign the front page and series: a featured latest post with a list of thumbnails below it, a series box and previous/next links in posts (from the `series` front matter, ordered by date), a compact top bar and menu button on phones, and a search page (Pagefind, built in the workflow after Hugo). Rename the series "North Star emulator" so it does not clash with the "NorthStar Emulator" menu entry.
- Fix the redesign after review: the cards, badges and series box follow the light and dark theme (CSS variables), the sidebar footnote sticks to the bottom of the sidebar, and emu_x86 part 3 has an image (debugger) for the home page and the social card.
- Tags page: keep the original list (grouped by year, with dates) and put all tags A to Z, with counts, in the theme contents panel (`toc-wrapper`, wide windows only); the search page lists all tags alphabetically under the results. Restyle the search "Clear" button as a quiet pill inside the box.
- Search: replace the stock Pagefind interface by our own page. Results are cards like the home rows (thumbnail, title, date, series badge, tags, excerpt with highlights, up to three matching sections), eight at a time; a made-up word shows "No results" because a result counts only when the highlight shares most letters with the typed word; `?q=` fills the box. Post data for the cards (title, image, date, series, tags) comes from attributes, so nothing is indexed twice, and the post header is excluded from excerpts. The tag list moved to the A-Z contents panel on wide windows, with the chip list shown below on narrower ones. Thumbnails that do not load fall back to the default picture.
- Move the 167 photos that were hotlinked from imgur (178 links; averaging 1.4 MB each) to `static/images/photos/`, shrunk to 1600 px (61 MB; the 10 PNG photos became JPEG). 173 links in 25 posts now point to the local copies. Eleven pictures of "Windows 1.0 install" no longer exist on imgur (it answers with its 503-byte "removed" image), so those links were left as they were.
- Mount `static/images` as `assets/images` so that Hugo can resize the pictures. A render hook for images gives every picture of a post lazy loading, its size (no jumping text), 800 px and 1600 px WebP copies for the browser, a caption when the alt text is a sentence, and click to enlarge (`assets/js/zoom.js`). The home page and the search results use small thumbnails made at build time. The workflow caches the Hugo `resources/` folder.
- Add a favicon (the avatar as a circle: `favicon.png`, `favicon.ico` with four sizes, `apple-touch-icon.png`) and link the last two in the head. Move the wider tag chips (a local edit inside the theme folder) to `assets/css/custom.css` and restore the theme file, so the change deploys.
- Keep the 178 original photos of imgur in `resources/photos/` (255 MB, ignored by git, not published) and write the procedure, the removed pictures and the list of unused pictures in `resources/photos.md` (tracked). Nothing unused was deleted.
- Fix two broken picture links of 2008 posts with files that were unused (`PickerVideo.gif`, `SPSRollUp_TipImages.gif`), checked by eye; two others (`MSBee1.gif`, `CCP2_Publish2.gif`) have no file. Update TODO.md and the list of unused pictures in `resources/photos.md`.
- Add the post about xsrv-web 0.1.0 (dated 2026-10-03, as asked) with three pictures of the project in `static/images/xsrv_web/`. The XFCE pictures show a clock of November 2026.
- SEO pass, after an audit of the built site: titles put the words of the page first ("Title | romheat"), the paginated home pages say "Page N", tag and series pages get their own title and description (they all had the title "csegura"); descriptions are cut at 155 characters and every page has its own (the 31 posts with only pictures or a video used the site description); one `h1` per page (the theme had two nested in the sidebar, and old posts had a `#` heading, now a level 2); `lang="es"` for the 93 Spanish posts (`htmlLang` in the front matter); `og:image` for every page (a post with an `image` in the front matter had none) with the first picture of the post, cut to 1200x630, and `og:type` article on posts; BreadcrumbList and a search box in the structured data; `noindex` and no sitemap entry for the 123 tags with fewer than 3 posts, the search page and `/about/about/` (canonical to `/about/`); the 25 `/posts/page/N/` copies of the post list are gone (the theme paginated a list that does not use a pager); a custom sitemap (429 to 304 URLs); a "Read next" block from tags. The theme's contents script is copied with a guard (it failed on pages with no post).
- Block 71 AI crawlers in `static/robots.txt` (training, AI search and answer fetchers, datasets), grouped by company; search engines and link preview bots stay allowed (Googlebot, bingbot, DuckDuckBot, Applebot, Bravebot, PetalBot, Yandex, facebookexternalhit). The list is a chosen part of the ai.robots.txt list.
- "Read next": remove the top border that the theme gives to `.related`, and give its heading a 3em top margin.
- Paragraph spacing: `p` gets `margin-bottom: 1.2em` and `.content li li > p` gets `margin-bottom: 0.5em` (the second rule matches no post today, because tight lists have no paragraphs).
- Heading spacing: `h1`-`h5` get `margin-top: 2em`. The rule also lists `strong`, but a margin has no effect on an inline element, so it does nothing there.
- Restore the picture viewer: my SEO rewrite of `layouts/partials/head/meta.html` dropped the `zoom.js` script and the favicon and touch icon links, so the viewer was dead on the live site. Add a "Check the build" step to the workflow that fails when the index or a post lacks the viewer script, icons, canonical link or JSON-LD.
- List spacing: `.content li, li > p` get the theme list colour and `margin-bottom: 0.6em`; nested list paragraphs keep their smaller margin by specificity.
