# Group website

Website for the founder, the holding company and its seven businesses (University, Green Foods,
Barbering Shop, Bank, Cosmetics, Foundation, Bicycle Run), with a Unified Service Center for
products, bookings, programmes, interest registration and Mobile Money checkout.

Built with React, Vite, React Router, Tailwind CSS v4 and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` creates a production build in `dist/`.

## Where things live

- **Content:** `src/lib/site.ts` holds names, contact details, the seven businesses, the Service Center catalog and the Mobile Money details. Replace every `[placeholder]` before launch.
- **Pages:** `src/pages/`, with routes in `src/App.tsx`.
- **Colours and font:** `src/index.css`. Gold (`--brand`) is reserved for buttons.
- **Images:** put photos in `public/images/` and set `image` on a business or offering in `src/lib/site.ts`. The founder portrait and the home page Service Center cards are set at the top of `src/pages/home.tsx`. Anything without an image shows a placeholder.

## Before launch

- **Forms:** copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`. Without it, submissions are not sent anywhere.
- **Prices:** an offering only shows "Add to cart" once it has a confirmed `price` and `status: "available"`.
- **Hosting:** this is a single-page app, so configure the host to serve `index.html` for every path (one rewrite rule on Vercel, Netlify or Cloudflare Pages).
