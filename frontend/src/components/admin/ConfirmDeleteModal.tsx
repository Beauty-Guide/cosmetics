import React from "react"

interface ConfirmDeleteModalProps {
  show: boolean
  onHide: () => void
  onConfirm: () => void
  itemName?: string // Опциональное имя элемента для более точного сообщения
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  show,
  onHide,
  onConfirm,
  itemName,
}) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-lg font-semibold">Подтверждение удаления</h5>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-800 text-xl"
            aria-label="Закрыть"
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700">
            Вы уверены, что хотите удалить{itemName ? ` "${itemName}"` : ""}?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onHide}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
