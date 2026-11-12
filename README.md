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
- **Shop:** each Service Center item has its own page at `/service-center/<id>` (`src/pages/offering.tsx`). Product cards, the cart drawer and shared shop styles live in `src/components/shop/` and `src/lib/shop.ts`. On the product page, an offering can also take `subtitle`, `compareAtPrice` (shows the old price struck through and a "Save" badge), `rating` (only from real reviews) and `gallery: [{ src: "/images/…", label: "Main view" }, …]`.
- **Colours and font:** `src/index.css`. Gold (`--brand`) is reserved for buttons.
- **Images:** put photos in `public/images/` and set `image` on a business or offering in `src/lib/site.ts`. The founder portrait and the home page Service Center cards are set at the top of `src/pages/home.tsx`. Anything without an image shows a placeholder.

## Before launch

- **Forms:** copy `.env.example` to `.env` and set `VITE_FORM_ENDPOINT`. Without it, submissions are not sent anywhere.
- **Prices:** an offering only shows "Add to cart" once it has a confirmed `price` and `status: "available"`. A few products carry `sample: true` test prices so the checkout can be tried; replace them with real prices (and remove `sample`) before launch.
- **Payments:** checkout runs Cart → Details → Payment → Confirmation.
  - *Online (Paystack):* Mobile Money (MTN, Telecel, AirtelTigo) and card. Create a Paystack business account, copy the **public** key (Settings → API Keys & Webhooks) into `VITE_PAYSTACK_PUBLIC_KEY` in `.env`, and add the same as a repository variable for the deployed site. Use the `pk_test_…` key until you are ready to take real money. Payouts go to the settlement account set in your Paystack dashboard.
  - *Manual Mobile Money:* always offered; the number and name are in `PAYMENT` in `src/lib/site.ts`. The customer enters their transaction ID and the team checks it by hand.
  - The site has no server, so it can't verify payments itself: check each order's reference in the Paystack dashboard before fulfilling it. For automatic verification, add a Paystack webhook to a small server function later.
- **Hosting:** every push to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`. The site is served from `/<repo-name>/`, and a copy of `index.html` is published as `404.html` so direct links to inner pages work. To deliver form submissions in the deployed site, add a repository variable `VITE_FORM_ENDPOINT` (Settings → Secrets and variables → Actions → Variables).
