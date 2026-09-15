# mabl-demo-site (local)

A small React demo website meant for practicing **mabl** test automation against stable UI patterns.

## Requirements
- Node.js 18+ recommended
- npm

## Quick start
```bash
npm install
npm run dev
```

Then open: http://localhost:5173

## What’s included (good for tests)
- **Buttons** with stable selectors (`data-testid`)
- **Toast** notifications
- **Modal** open/close (close by overlay, X button, or Escape)
- **Tabs** switching panels
- **Form validation** (newsletter + mock login)
- **Stateful widgets** (counter, toggle, slider)
- **Searchable table** with row count + empty state
- **Accordion** (FAQ)

## Selector tips
Look for `data-testid` attributes:
- `btn-open-modal`, `modal`, `btn-modal-close`
- `btn-toast`, `toast`, `btn-toast-close`
- `newsletter-email`, `btn-newsletter-submit`, `newsletter-error`
- `login-email`, `login-password`, `btn-login`, `login-status`
- `table-search`, `table-count`, `customer-table`, `row-CUST-001`, etc.

## Customize
This is intentionally simple. Add pages, routing, mock APIs, auth flows, file uploads — anything you want to expand your test surface.

Have fun 👋 