# Academic Website

Hugo-based personal academic research portfolio for PhD applications, faculty contact, CV access, and research project presentation.

## Local Preview

```sh
sh scripts/prepare-my-lens-images.sh
hugo server
```

## Content Editing

- Home: `content/_index.md`
- About: `content/about/_index.md`
- Projects: `content/projects/`
- Public images: `static/images/`
- CV PDF: `static/cv/`
- Project source materials: `project detail/`

The `project detail/` directory is the manual project source repository for project figures, PPT/PDF files, notes, and source materials. Website-ready images live in `static/images/` and are copied into `public/` by Hugo during builds. Do not edit generated files in `public/` directly.

My Lens source photos live in `static/images/about/my-lens/` and may include HEIC originals. Use numeric filenames such as `5.jpg`, `5.1.HEIC`, and `5.2.jpeg`; the script orders them as `5`, `5.1`, `5.2`, converts them to browser-compatible JPEGs in `static/images/about/my-lens/web/`, and generates Hugo's ordered image data automatically. Run `sh scripts/prepare-my-lens-images.sh` before building. The script uses `heif-convert` from libheif for HEIC decoding, then resizes and encodes JPEGs with macOS `sips`.
