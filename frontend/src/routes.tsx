import { Route, Routes } from "react-router"

import PrivateRoute from "./components/PrivateRoute"

import LoginForm from "./pages/LoginForm"
import HomePage from "./pages/HomePage"

import Cosmetic from "./pages/admin/CosmetiForm"
import ActionForm from "./pages/admin/ActionForm"
import CatalogForm from "./pages/admin/CatalogForm"
import SkinTypeForm from "./pages/admin/SkinTypeForm"
import BrandForm from "./pages/admin/BrandForm"
import IngredientForm from "./pages/admin/IngredientForm"
import Sandbox from "./pages/Sandbox"
import ProductPage from "./pages/ProductPage"
import Layout from "./components/Layout"
import Favorites from "./pages/Favorites"
import LoginSuccess from "@/pages/LoginSuccess.tsx"
import CosmeticBag from "./pages/сosmetic-bag"
import CosmeticBugItems from "./pages/сosmetic-bag/CosmeticBugItems"
import AnalyticsPage from "@/pages/analytics/AnalyticsPage.tsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/app" element={<Sandbox />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        <Route path="/category" element={<HomePage />}>
          <Route path="*" element={<HomePage />} />
        </Route>

        <Route path="/product/:productId" element={<ProductPage />} />

        <Route path="/cosmetic-bag/:id" element={<CosmeticBugItems />} />

        <Route path="*" element={<h1>404</h1>} />

        {/* Защищённые маршруты */}
        <Route
          path="/favorites"
          element={
            <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route
          path="/cosmetic-bag"
          element={
            <PrivateRoute allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}>
              <CosmeticBag />
            </PrivateRoute>
          }
        />
          <Route path="/analytics" element={<AnalyticsPage />} />
        {/* Админка */}
        <Route path="/admin">
          <Route
            path="/admin/cosmetic"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <Cosmetic />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/catalog"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <CatalogForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/brand"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <BrandForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/action"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <ActionForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/skinType"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <SkinTypeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/ingredient"
            element={
              <PrivateRoute allowedRoles={["ROLE_ADMIN"]}>
                <IngredientForm />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
