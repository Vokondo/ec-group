import { createBrowserRouter } from "react-router";
import { Layout } from "@/components/layout";
import AboutPage from "@/pages/about";
import BusinessDetailPage from "@/pages/business-detail";
import BusinessesPage from "@/pages/businesses";
import CheckoutPage from "@/pages/checkout";
import { BookingPage, ContactPage, InterestPage } from "@/pages/forms";
import HoldingPage from "@/pages/holding";
import HomePage from "@/pages/home";
import NotFoundPage from "@/pages/not-found";
import ServiceCenterPage from "@/pages/service-center";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "holding", element: <HoldingPage /> },
      { path: "businesses", element: <BusinessesPage /> },
      { path: "businesses/:slug", element: <BusinessDetailPage /> },
      { path: "service-center", element: <ServiceCenterPage /> },
      { path: "service-center/booking", element: <BookingPage /> },
      { path: "service-center/interest", element: <InterestPage /> },
      { path: "service-center/checkout", element: <CheckoutPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
