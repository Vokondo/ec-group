import { Outlet, ScrollRestoration } from "react-router";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function Layout() {
  return (
    <CartProvider>
      <div className="flex min-h-svh flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <ScrollRestoration />
    </CartProvider>
  );
}
