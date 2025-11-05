# Barati.dev

A personal portfolio and resume site for Bharathiraja Muthurajan, Data Platform and AI Engineer. Built with Jekyll, featuring project showcases, a downloadable resume, and automated PDF generation.

## Features

- **Project Showcases**: Projects are managed as a Jekyll collection in `_projects/` for clean URLs and easy management.
- **Resume**: 
  - Viewable as a web page (`resume.html`).
  - Downloadable as a PDF (`assets/BM_resume.pdf`), auto-generated from Markdown.
- **Automated PDF Generation**: 
  - Uses Jekyll to build the site and WeasyPrint to generate a PDF from the Markdown resume.
  - Managed via GitHub Actions workflow (`.github/workflows/build-and-deploy-barati-dev.yml`).

## Directory Structure

```
.
├── _config.yml                # Jekyll configuration
├── _includes/                 # Reusable HTML components (e.g., header)
├── _layouts/                  # Jekyll layouts (default, project)
├── _projects/                 # Project collection (each project as a markdown file)
├── assets/
│   ├── BM_resume.md           # Resume in Markdown
│   ├── BM_resume.pdf          # Auto-generated PDF resume
│   ├── css/style.scss         # Main stylesheet
│   ├── img/Bharathi.png       # Profile image
│   └── js/generate-pdf.js     # Puppeteer script for PDF generation (legacy)
├── content/                   # (Legacy) Project list and markdowns (to be migrated)
├── index.md                   # Main landing page
├── resume.html                # Resume web page
├── .github/workflows/
│   └── build-and-deploy-barati-dev.yml # GitHub Actions workflow
└── CNAME                      # Custom domain config
```

## Contact

- [LinkedIn](https://www.linkedin.com/in/bharathirajam)
- [GitHub](https://github.com/brt-rj)
- [Email](mailto:barati_m@pm.me)