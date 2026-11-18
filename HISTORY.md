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
