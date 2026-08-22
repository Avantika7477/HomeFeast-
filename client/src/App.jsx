import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Protected from "./components/Protected";
import Shell from "./components/Shell";
import PublicLayout from "./components/PublicLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import CookPublic from "./pages/CookPublic";
import CustomerOrders from "./pages/CustomerOrders";
import CustomerSubscriptions from "./pages/CustomerSubscriptions";
import CustomerComplaints from "./pages/CustomerComplaints";
import CookDashboard from "./pages/cook/CookDashboard";
import CookProfilePage from "./pages/cook/CookProfile";
import CookMenu from "./pages/cook/CookMenu";
import CookOrders from "./pages/cook/CookOrders";
import CookSubscriptions from "./pages/cook/CookSubscriptions";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCooks from "./pages/admin/AdminCooks";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminComplaints from "./pages/admin/AdminComplaints";

export default function App() {
  const { ready } = useAuth();
  if (!ready) return <p className="p-8 text-sm text-ink/60">Loading HomeFeast…</p>;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PublicLayout />}>
        <Route path="/browse" element={<Browse />} />
        <Route path="/cooks/:id" element={<CookPublic />} />
      </Route>

      <Route
        element={
          <Protected roles={["customer"]}>
            <Shell />
          </Protected>
        }
      >
        <Route path="/orders" element={<CustomerOrders />} />
        <Route path="/subscriptions" element={<CustomerSubscriptions />} />
        <Route path="/complaints" element={<CustomerComplaints />} />
      </Route>

      <Route
        element={
          <Protected roles={["cook"]}>
            <Shell />
          </Protected>
        }
      >
        <Route path="/cook" element={<CookDashboard />} />
        <Route path="/cook/profile" element={<CookProfilePage />} />
        <Route path="/cook/menu" element={<CookMenu />} />
        <Route path="/cook/orders" element={<CookOrders />} />
        <Route path="/cook/subscriptions" element={<CookSubscriptions />} />
      </Route>

      <Route
        element={
          <Protected roles={["admin"]}>
            <Shell />
          </Protected>
        }
      >
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/cooks" element={<AdminCooks />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/complaints" element={<AdminComplaints />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
