# csegura.github.io

Personal blog built with [Hugo](https://gohugo.io) (extended, 0.147.9) and the
[poison](https://github.com/lukeorth/poison) theme. GitHub Actions deploys it to GitHub Pages on each push to `main`.

## Run locally

```sh
git submodule update --init
hugo server
```

The search page needs an index that is built after Hugo, so it is empty under `hugo server`. To try it locally:

```sh
hugo --minify -d /tmp/site
npm exec --yes pagefind@1.6.0 -- --site /tmp/site
python3 -m http.server -d /tmp/site 8080
```

The GitHub workflow runs the same Pagefind step before it publishes.

## SEO

- The head metadata is built in `layouts/partials/head/meta.html`: title, description, canonical address, `robots`, the language, the social picture (`layouts/partials/og-image.html`) and the structured data (BlogPosting, BreadcrumbList, WebSite with a search box).
- A post is in Spanish when its front matter has `htmlLang = 'es'`; the page then has `lang="es"` and `og:locale` `es_ES`.
- `description` in the front matter wins; without it, the first 155 characters of the text are used. Keep it between 50 and 155 characters.
- A tag with fewer than 3 posts, the search page and `/about/about/` are `noindex` and left out of the sitemap (`layouts/_default/sitemap.xml`).
- `layouts/partials/related.html` makes the "Read next" block from the tags of a post (`[related]` in `hugo.toml`).

## Pictures

- `static/images/` holds the pictures. It is also mounted as `assets/images` (see `hugo.toml`), so Hugo can make smaller copies when the site is built: the thumbnails of the home page and of the search, and the 800 px and 1600 px WebP copies that a post offers to a browser (`layouts/_default/_markup/render-image.html`).
- `static/images/photos/` holds the photos that used to be hotlinked from imgur, shrunk to 1600 px. The full-size originals are not in the repository.
- The first build processes about 300 pictures and takes two minutes; Hugo keeps the result in `resources/` (not committed), and the workflow caches that folder.
- Clicking a picture in a post opens it large (`assets/js/zoom.js`). A caption appears under a picture when its alt text is a sentence of four words or more.

## Structure

- `content/posts/<year>/` posts, `content/about/` About page
- `layouts/partials/head/meta.html` overrides the theme meta partial (post description from the first paragraph, absolute `og:image`)
- `static/` images and `robots.txt`
- `hugo.toml` site and theme settings
