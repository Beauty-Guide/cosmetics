import { Route, Routes } from "react-router"

import PrivateRoute from "./components/PrivateRoute"

import LoginForm from "./pages/LoginForm"
import HomePage from "./pages/HomePage"

import Cosmetic from "./pages/CosmetiForm"
import ActionForm from "./pages/ActionForm"
import CatalogForm from "./pages/CatalogForm"
import SkinTypeForm from "./pages/SkinTypeForm"
import BrandForm from "./pages/BrandForm"
import IngredientForm from "./pages/IngredientForm"
import Sandbox from "./pages/Sandbox"
import ProductPage from "./pages/ProductPage"
import Layout from "./components/Layout"
import Favorites from "./pages/Favorites"
import LoginSuccess from "@/pages/LoginSuccess.tsx";

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
          path="/admin"
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
    </Routes>
  )
}

export default AppRoutes
