import { Outlet, ScrollRestoration } from "react-router";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CartDrawer } from "@/components/shop/cart-drawer";

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
      <CartDrawer />
      <ScrollRestoration />
    </CartProvider>
  );
}
