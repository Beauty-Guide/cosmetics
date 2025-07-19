// src/components/AdminPanel.tsx
import React from "react"
import CosmeticForm from "../../pages/CosmetiForm"
import SkinTypeForm from "../../pages/SkinTypeForm"
import ActionForm from "../../pages/ActionForm"
import "../css/AdminPanel.css" // Подключаем стили

const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <h2>Панель администратора</h2>

      <div className="form-section">
        <h3>Добавить косметику</h3>
        <CosmeticForm />
      </div>

      <div className="form-section">
        <h3>Добавить тип кожи</h3>
        <SkinTypeForm />
      </div>

      <div className="form-section">
        <h3>Добавить действие косметики</h3>
        <ActionForm />
      </div>
    </div>
  )
}

export default AdminPanel
