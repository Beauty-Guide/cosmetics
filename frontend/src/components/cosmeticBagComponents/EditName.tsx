import { useState } from "react"
import { Button } from "../ui/button"
import { CheckCheckIcon, Edit2Icon } from "lucide-react"
import { Input } from "../ui/input"
import CosmeticBagLikeBtn from "./CosmeticBagLikeBtn"
import { useAuth } from "@/config/auth-context"

type TEditNameProps = {
  name: string
  isOwner: boolean
  onSaveEditName: (newName: string) => void
}

const EditName = ({ name, isOwner, onSaveEditName }: TEditNameProps) => {
  const user = useAuth()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>("")

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleEditSave = () => {
    setIsEditing(false)

    if (newName.length < 2 || newName === name) return
    onSaveEditName(newName)
  }

  if (!isOwner)
    return (
      <div className="flex items-center justify-between gap-1 w-full my-2">
        <h1 className="text-2xl font-semibold mr-auto">{name}</h1>
        {user?.isAuthenticated && <CosmeticBagLikeBtn />}
      </div>
    )

  return (
    <div className="flex items-center justify-between gap-1 w-full my-2">
      {!isEditing ? (
        <h1 className="text-2xl font-semibold mr-auto">{name}</h1>
      ) : (
        <Input
          className="text-2xl font-semibold mr-auto p-2"
          defaultValue={name}
          onChange={(e) => setNewName(e.target.value)}
        />
      )}

      {isEditing && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleEditSave}
        >
          <CheckCheckIcon />
        </Button>
      )}
      {!isEditing && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={handleEdit}
        >
          <Edit2Icon />
        </Button>
      )}
    </div>
  )
}

export default EditName
