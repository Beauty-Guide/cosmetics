import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

type TProps = {
  handleCreateCosmeticBag: ({ name }: { name: string }) => void
}

const CreateCosmeticBagModal = ({ handleCreateCosmeticBag }: TProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>("")

  const handleAdd = () => {
    if (name.length < 2) {
      toast.error(t("cosmeticBag-add-error-name"))
      return
    }
    handleCreateCosmeticBag({ name })
    setName("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("cosmeticBag-create-button")}</Button>
      </DialogTrigger>
      <DialogContent className="w-2/3 max-md:w-full max-w-none sm:max-w-full flex flex-col justify-start items-start top-[5vh] max-md:top-0 translate-y-0 gap-1 rounded-md">
        <DialogHeader className="my-5 w-full">
          <DialogTitle>{t("cosmeticBag-create")}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-2 my-3">
          <Input
            type="text"
            name="name"
            id="name"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder={t("cosmeticBag-name")}
          />
        </div>
        <DialogFooter className="w-full flex items-center">
          <Button variant="outline" form="search-form" onClick={handleAdd}>
            {t("cosmeticBag-create-button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCosmeticBagModal
