import { useNavigate } from "react-router";
import { getBusiness, type Offering } from "@/lib/site";
import { useCart } from "@/components/cart-provider";

// Cart actions for an offering: add (opening the cart drawer) or buy now (straight to checkout).
export function useShop() {
  const cart = useCart();
  const navigate = useNavigate();
  const line = (o: Offering) => ({ id: o.id, name: o.name, business: getBusiness(o.business)?.name ?? "", price: o.price ?? 0 });
  return {
    ...cart,
    inCart: (o: Offering) => cart.lines.some((l) => l.id === o.id),
    addToCart: (o: Offering, qty = 1) => cart.add(line(o), { qty }),
    buyNow: (o: Offering, qty = 1) => {
      if (!cart.lines.some((l) => l.id === o.id)) cart.add(line(o), { qty, silent: true });
      navigate("/service-center/checkout");
    },
  };
}
