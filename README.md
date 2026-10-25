# csegura.github.io

Personal blog built with [Hugo](https://gohugo.io) (extended, 0.147.9) and the
[poison](https://github.com/lukeorth/poison) theme. GitHub Actions deploys it to GitHub Pages on each push to `main`.

## Run locally

```sh
git submodule update --init
hugo server
```

## Structure

- `content/posts/<year>/` posts, `content/about/` About page
- `layouts/partials/head/meta.html` overrides the theme meta partial (post description from the first paragraph, absolute `og:image`)
- `static/` images and `robots.txt`
- `hugo.toml` site and theme settings
