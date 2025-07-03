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
import ItemPage from "./pages/ItemPage"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Публичные маршруты */}
      <Route path="/app" element={<Sandbox />} />
      <Route path="/login" element={<LoginForm />} />
      <Route index path="/" element={<HomePage />} />
      <Route path="/item/:id" element={<ItemPage />} />

      <Route path="*" element={<h1>404</h1>} />

      {/* Защищённые маршруты */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Cosmetic />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/catalog"
        element={
          <PrivateRoute>
            <CatalogForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/brand"
        element={
          <PrivateRoute>
            <BrandForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/action"
        element={
          <PrivateRoute>
            <ActionForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/skinType"
        element={
          <PrivateRoute>
            <SkinTypeForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/ingredient"
        element={
          <PrivateRoute>
            <IngredientForm />
          </PrivateRoute>
        }
      />
    </Routes>
  )
}

export default AppRoutes
