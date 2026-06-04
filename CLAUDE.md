---
trigger: always_on
---

# claude.md — Hướng dẫn cho Claude (và các AI khác)

Thư mục này (`D:\noel`) là nơi mình tạo các **layout HTML/CSS/JS dạng static** (prototype / landing page / thiệp / mini-site) để mở trực tiếp bằng trình duyệt.

> NOTE FOR AGENT: Human notes may be Vietnamese. **Follow the English instructions below.**

## Project intent (English)

You are working in a repo that stores **standalone HTML layouts**. Most pages should be viewable by opening the `.html` file directly (no build step).

### Output expectations
- Prefer a **single self-contained HTML file** (inline `<style>` + minimal `<script>`) unless asked to split into `styles.css` / `script.js`.
- Use semantic HTML (`header/main/footer/nav/section`), responsive CSS, and keyboard-accessible interactions.
- Default language is Vietnamese: use `lang="vi"` unless the user requests otherwise.
- Avoid unnecessary dependencies. If you use external fonts/CDNs, keep it minimal and graceful when offline.

### File & folder conventions
- New layouts: add a new `*.html` at repo root or under `new/` (use `new/` for experiments / drafts).
- Images: prefer local assets under `images/` (or `new/images/` if the layout lives in `new/`). Avoid hotlinking.
- Names: use `kebab-case.html` (e.g. `summer-sale-landing.html`).

### Quality checklist (quick)
- Mobile-first layout; no horizontal scrolling on 375px width.
- Contrast and focus states; navigable by keyboard (Tab/Shift+Tab/Enter/Escape).
- No console errors on load.
- Keep JS defensive (null checks) and avoid global pollution where possible.

