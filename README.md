# studareLatinus.io

Latin I & II study materials — static single-file site.

- Everything lives in one self-contained file: `index.html` (CSS, JS, and images inline).
- No server required. Open `index.html` directly or host it on any static host (GitHub Pages, etc.).

## Suggestion button

The gold "Suggestions" button in the bottom-right currently links to `#`.
Replace the `href` in `index.html` with your Google Form link:

```html
<a class="suggestions-toggle" href="YOUR_GOOGLE_FORM_URL" ...>
```