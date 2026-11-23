# RONAKOGRAPHY — website

A responsive, GitHub Pages-ready portfolio site for **Ronak Motirai**. Built with plain HTML, CSS and JavaScript — no installation, build step or framework required.

## Preview locally

Open `index.html` in a browser. For the best local testing experience, use VS Code's Live Server extension.

## Add your logo

1. Put your logo image in `assets/images/` (for example, `logo.png`).
2. Open `assets/js/site-config.js`.
3. Set `logoPath: "assets/images/logo.png"`.

The dashed logo box in the header is the reserved logo space. It is replaced automatically when `logoPath` is set.

## Add your photos and videos

1. Put thumbnail images in `assets/media/thumbnails/`.
2. Put MP4 videos in `assets/media/videos/`.
3. Open `assets/js/portfolio.js` and edit the `window.PORTFOLIO_ITEMS` list.

Each project can use these fields:

```js
{
  title: "Wedding Highlights",
  tag: "WEDDING FILM",
  category: "promotion",
  thumbnail: "assets/media/thumbnails/wedding-cover.jpg",
  video: "assets/media/videos/wedding-highlights.mp4",
  youtubeId: "",
  image: ""
}
```

Use one of these category values so the category filters work:

- `commercial` — Commercial & Cinematic
- `product` — Product & Portraits
- `promotion` — Promotion & Events
- `realestate` — Interior & Lifestyle

For a YouTube video, leave `video` blank and fill in `youtubeId` with the video ID. For a photo-only project, fill `image` with its path (and optionally use the same path as `thumbnail`). The viewer supports local MP4 video, YouTube embeds and full-size photos.

You can add as many project objects as you want or remove the starter entries. Each project automatically appears in the right filter and the gallery count updates by itself.

## Update phone and Instagram

Open `assets/js/site-config.js`:

```js
phoneDisplay: "+91 8160610973",
phoneNumber: "+918160610973",
whatsappNumber: "918160610973",
instagramUsername: "", // add username without @
```

The phone and WhatsApp links are already set to the number provided. Add the Instagram username without `@` (for example `ronakography`) and the Instagram link will activate automatically.

## Publish with GitHub Pages

1. Create a new GitHub repository, for example `ronakography`.
2. Upload all files and folders from this project to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then save.
6. GitHub Pages will publish the site at `https://YOUR-USERNAME.github.io/ronakography/`.

## Media tips

- Use compressed JPG or WebP thumbnails; around 150–350 KB is a good target.
- Use MP4 (H.264) for local video playback.
- Keep large video files reasonably sized. For very large projects, use YouTube or another video host and enter its YouTube ID / hosted video URL in the project data.
- Keep filenames simple and avoid spaces where possible.

## Folder map

```text
ronakography-website/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── images/favicon.svg
    ├── images/                 # add your logo here
    ├── js/
    │   ├── site-config.js      # name, phone, Instagram, logo
    │   ├── portfolio.js        # gallery projects / media paths
    │   └── main.js             # filters and media viewer
    └── media/
        ├── thumbnails/         # add project cover photos here
        └── videos/             # add MP4 videos here
```
