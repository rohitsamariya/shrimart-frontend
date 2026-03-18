import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { CustomerLoginPage } from "./components/CustomerLoginPage";
import { RiderLoginPage } from "./components/RiderLoginPage";
import { AdminLoginPage } from "./components/AdminLoginPage";
import { RoleGuard } from "./components/auth/RoleGuard";

import { CustomerLayout } from "./components/customer/CustomerLayout";
import { CustomerHome } from "./components/customer/CustomerHome";
import { ProductDetail } from "./components/customer/ProductDetail";
import { CartPage } from "./components/customer/CartPage";
import { AddressPage } from "./components/customer/AddressPage";
import { ConfirmationPage } from "./components/customer/ConfirmationPage";
import { TrackingPage } from "./components/customer/TrackingPage";
import { HistoryPage } from "./components/customer/HistoryPage";
import { ProfilePage } from "./components/customer/ProfilePage";
import { SearchPage } from "./components/customer/SearchPage";
import { RiderLayout } from "./components/rider/RiderLayout";
import { RiderDashboard } from "./components/rider/RiderDashboard";
import { RiderProfilePage } from "./components/rider/RiderProfilePage";
import { RiderHistoryPage } from "./components/rider/RiderHistoryPage";
import { NewOrderPage } from "./components/rider/NewOrderPage";
import { NavigatePage } from "./components/rider/NavigatePage";
import { DeliveryPage } from "./components/rider/DeliveryPage";
import { EarningsPage } from "./components/rider/EarningsPage";
import { AdminDashboard } from "./components/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login/customer", Component: CustomerLoginPage },
      { path: "login/rider", Component: RiderLoginPage },
      { path: "login/admin", Component: AdminLoginPage },
      {
        path: "customer",
        element: <RoleGuard role="user" />,
        children: [
          {
            path: "",
            Component: CustomerLayout,
            children: [
              { index: true, Component: CustomerHome },
              { path: "product/:id", Component: ProductDetail },
              { path: "cart", Component: CartPage },
              { path: "address", Component: AddressPage },
              { path: "confirmation", Component: ConfirmationPage },
              { path: "tracking", Component: TrackingPage },
              { path: "history", Component: HistoryPage },
              { path: "profile", Component: ProfilePage },
              { path: "search", Component: SearchPage },
            ],
          }
        ],
      },
      {
        path: "rider",
        element: <RoleGuard role="rider" />,
        children: [
          {
            path: "",
            Component: RiderLayout,
            children: [
              { index: true, Component: RiderDashboard },
              { path: "order", Component: NewOrderPage },
              { path: "navigate", Component: NavigatePage },
              { path: "delivery", Component: DeliveryPage },
              { path: "earnings", Component: EarningsPage },
              { path: "history", Component: RiderHistoryPage },
              { path: "profile", Component: RiderProfilePage },
            ],
          }
        ],
      },
      {
        path: "admin",
        element: <RoleGuard role="admin" />,
        children: [
          { index: true, Component: AdminDashboard },
        ]
      },
    ],
  },
]);
