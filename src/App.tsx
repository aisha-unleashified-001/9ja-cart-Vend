import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { PopupProvider } from "./components/ui/Popup";
import { ErrorBoundary } from "./components/ui/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import RegisterSuccess from "./pages/auth/register/RegisterSuccess";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import AddProductPage from "./pages/products/AddProductPage";
import EditProductPage from "./pages/products/EditProductPage";
import OrdersPage from "./pages/orders/OrdersPage";
import StorefrontPage from "./pages/storefront/StorefrontPage";
import PublicStorefrontPage from "./pages/storefront/PublicStorefrontPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import NotificationDetailPage from "./pages/notifications/NotificationDetailPage";
import ContactAdminPage from "./pages/contact/ContactAdminPage";
import ContactPage from "./pages/ContactPage";
import SettingsPage from "./pages/settings/SettingsPage";
import AuthLayout from "./components/layout/AuthLayout";
import SellProductPage from "./pages/SellProductPage";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  // Initialize auth state on app start
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <PopupProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/sell-product" element={<SellProductPage />} />
          <Route path="/vendor/:vendorId" element={<PublicStorefrontPage />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/success" element={<RegisterSuccess />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/products"
              element={
                <ErrorBoundary>
                  <ProductsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ErrorBoundary>
                  <ProductDetailPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/products/:id/edit"
              element={
                <ErrorBoundary>
                  <EditProductPage />
                </ErrorBoundary>
              }
            />
            <Route path="/products/new" element={<AddProductPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/storefront" element={<StorefrontPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route
              path="/notifications/:id"
              element={<NotificationDetailPage />}
            />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/contact-admin" element={<ContactAdminPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </PopupProvider>
  );
}
