# Dramawize

The official website of **Dramawize** — built by Manasi Goyal to cultivate confidence, communication, critical thinking and collaboration in every child through the craft of drama.

🌐 Live site: [dramawize.com](https://dramawize.com)
📧 Contact: manasi@dramawize.com

---

## Repository contents

| File | What it is |
|---|---|
| `index.html` | Homepage — the full Dramawize site (Vivid Botanical design) |
| `register.html` | Trial-class registration form with thank-you modal |
| `404.html` | Custom 404 page in the same brand language |
| `CNAME` | Custom-domain config — tells GitHub Pages to serve at `dramawize.com` |
| `dramawize-form-handler.gs` | Google Apps Script that powers the form (NOT served — deployed separately to Google Sheets) |

---

## Hosting — GitHub Pages

This site is a fully static HTML / CSS / JavaScript build with no server dependencies. It runs anywhere — currently hosted free on GitHub Pages and pointed at the `dramawize.com` custom domain.

To deploy:

1. Repository **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` / root
4. **Custom domain:** `dramawize.com`
5. Enable **Enforce HTTPS**

DNS records to add at the domain registrar:

| Type | Host | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | `<github-username>.github.io` |

---

## The registration form — backend setup

The `register.html` form posts to a Google Apps Script Web App that does two things automatically on every submission:

1. Appends a new row to a Google Sheet (timestamp + all eight form fields)
2. Sends an HTML-formatted email to `manasi@dramawize.com`

To wire it up (one-time, ~5 minutes):

1. Sign in to `manasi@dramawize.com` Google account
2. Create a new Google Sheet at sheets.google.com — name it "Dramawize · Trial Bookings"
3. **Extensions → Apps Script** → paste the contents of `dramawize-form-handler.gs`
4. Save → **Deploy → New deployment → Web app**
5. **Execute as:** Me, **Who has access:** Anyone — Deploy
6. Copy the deployed Web App URL
7. In `index.html` and `register.html`, find the line `const APPS_SCRIPT_URL = 'PASTE_YOUR_...'` and replace with your URL
8. Commit and push

Full step-by-step in `dramawize-form-setup-guide.docx`.

---

## Brand voice

Bold, contrarian, warmly authoritative. We don't sell acting classes — we sell transformation, future-readiness and emotional resilience for the modern child.

**The four pillars of modern excellence:**
Unshakeable Confidence · Authentic Communication · Agile Critical Thinking · Empathetic Collaboration.

**The three delivery modes:**
School Integration (B2B) · Studio Academies (B2C) · Educator Empowerment.

---

© Dramawize · All rights reserved.
