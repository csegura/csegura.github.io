## 2026-10-25

- Switch the poison submodule URL to HTTPS so CI and fresh clones need no SSH key.
- Set the real `baseURL` so the sitemap and RSS use absolute URLs.
- Override the theme meta partial: the theme left post descriptions empty and wrote a relative `og:image`. Posts now use the first paragraph.
- Remove placeholder socials, duplicate Disqus keys and unused Sass and Node steps (the build passes without them).
- Add `robots.txt` with the sitemap URL.
