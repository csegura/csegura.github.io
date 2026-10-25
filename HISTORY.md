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
