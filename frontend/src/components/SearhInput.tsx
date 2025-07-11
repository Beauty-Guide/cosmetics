import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { DeleteIcon, HistoryIcon, Search } from "lucide-react"
import type { TUserHistory } from "@/types"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Separator } from "./ui/separator"

type TSearhInputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  props?: React.ComponentProps<"input">
  searchHistory: TUserHistory[]
  handleSelectOption: (option: string) => void
  handleDeleteHistoryOption: (id: number) => void
}

const SearhInput = forwardRef<HTMLInputElement, TSearhInputProps>(
  (
    {
      className,
      searchHistory,
      handleSelectOption,
      handleDeleteHistoryOption,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    return (
      <div className="flex w-full relative z-40">
        {open && (
          <div
            className="fixed inset-0 bg-black/30 z-10"
            onClick={() => setOpen(false)}
          />
        )}
        <Input
          type="search"
          className={cn(className, open && "rounded-l-md", "z-40 bg-white")}
          ref={ref}
          onFocus={() => setOpen(true)}
          onChange={(e) => setValue(e.target.value)}
          {...props}
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="rounded-l-none rounded-r-md border-l-0 z-40"
          onClick={() => setOpen(false)}
        >
          <Search />
        </Button>
        {open && (
          <div
            className={cn(
              "absolute top-full left-0 bg-white p-2 border-1 mt-1 rounded-md w-full z-10 max-w-[550px]"
            )}
          >
            <h2 className="text-lg font-semibold mb-2 px-2 select-none">
              {t("nav.search_history")}
            </h2>
            {searchHistory.length > 0 ? (
              searchHistory
                .filter((item) => item.searchQuery.includes(value))
                .splice(0, 5)
                .map((item) => (
                  <div key={item.id}>
                    <Separator />
                    <div className="flex items-center justify-between px-2 my-1 rounded-md w-full">
                      <div
                        onClick={() => {
                          handleSelectOption(item.searchQuery)
                          setOpen(false)
                        }}
                        className="flex items-center p-2 justify-between rounded-md w-full hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <HistoryIcon />
                          <p>{item.searchQuery}</p>
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteHistoryOption(item.id)}
                        className="z-100 w-10 h-10 hover:bg-black/10"
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <div>
                <Separator />
                <p className="px-2">{t("nav.no_search_history")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)

export default SearhInput
