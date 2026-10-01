# Fábio Araújo: portfolio site

A static site: plain HTML, CSS, and JavaScript. No build step, no framework.
Double-click `index.html` to preview it in your browser.

## Updating the site

Everything you change lives in **`content.js`**. You never need to edit HTML.

| To do this | Do this |
|---|---|
| Add a project | Copy a `{ ... }` block in `content.js`, change its fields, create `media/<slug>/` for its images |
| Add a video | Paste its Vimeo or YouTube link into `video` |
| Add photos | Export them for web (JPG, about 2400 px on the long edge, under 1 MB), put them in `media/<slug>/`, list them in `gallery` |
| Set a cover image | Put `cover.jpg` in the project folder and set `cover: "media/<slug>/cover.jpg"` |
| Hide a project | Add `hidden: true` |
| Add a showreel | Paste its link into `site.showreel`; a "Play reel" button appears in the hero |
| Hero film strip | Shows film covers automatically (featured first); change how many with `site.heroStripCount` |
| Work sections | Edit `groups`: each lists the categories it shows (e.g. Personal & Freelance, Jobs) |
| Hover preview on a film | Short muted `.mp4` in the project folder, set `preview` |
| Feature a film | `featured: true` puts it first and full width in its section, and first in the hero strip |
| Update your CV | Edit the `cv` list; add a PDF with `site.cvFile` |

Empty fields show a clearly marked placeholder, so the site never breaks while content is missing.

## Where media should live

- **Video: Vimeo or YouTube.** Big video files make the site slow and hit hosting limits. Uploaded `.mp4` files still work for short muted loops.
- **Photos: in `media/`.** Small, fast, and fully under your control.
- **Instagram:** link to it from the footer rather than embedding posts.

## Folders

```
fabio-portfolio/
  index.html        the page
  content.js        all your content: edit this
  css/style.css     the design
  js/main.js        builds the page from content.js
  media/
    _site/          reel loop, portrait, site-wide images
    <slug>/         one folder per project
```

## Previewing

Double-clicking `index.html` works for everything except some YouTube embeds, which refuse to play from a local file. If a YouTube video shows an error, preview through a local server instead:

```
cd ~/Documents/fabio-portfolio && python3 -m http.server 8000
```

Then open http://localhost:8000. Vimeo works either way. Once the site is hosted online, both work.
