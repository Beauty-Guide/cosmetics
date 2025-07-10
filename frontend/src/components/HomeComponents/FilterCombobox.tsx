import { useMemo, useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

type Option = {
  name: string
  id: string
}

interface MultiSelectComboboxProps {
  label: string
  options: Option[]
  values: string[]
  onChange: (values: string[]) => void
  singleSelect?: boolean
  labels?: boolean
  badges?: boolean
  showOnlyLabel?: boolean
  variant?: "default" | "ghost" | "outline"
  className?: string
}

export default function MultiSelectCombobox({
  label,
  options,
  values,
  onChange,
  singleSelect = false,
  labels = true,
  badges = true,
  variant = "outline",
  showOnlyLabel = false,
  className,
}: MultiSelectComboboxProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)

  const toggleValue = (value: string) => {
    if (singleSelect) {
      if (values.includes(value)) {
        onChange([])
      } else {
        onChange([value])
      }
      setOpen(false)
    } else {
      if (values.includes(value)) {
        onChange(values.filter((v) => v !== value))
      } else {
        onChange([...values, value])
      }
    }
  }

  const selectedLabels = useMemo(() => {
    return options
      .filter((opt) => values.includes(String(opt.id)))
      .map((opt) => opt.name)
  }, [options, values])

  return (
    <div className={cn("w-full max-w-[200px]", className)}>
      {labels && (
        <label className="block mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            role="combobox"
            className="w-full justify-between overflow-hidden"
          >
            {selectedLabels.length > 0 && !showOnlyLabel
              ? singleSelect
                ? selectedLabels[0]
                : selectedLabels.join(", ")
              : `${label}`}
            <ChevronsUpDown className="ml-2 max-md:ml-0 h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`${t("search")} ${label}...`} />
            <CommandEmpty>{t("filter.not_found")}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  onSelect={() => toggleValue(String(opt.id))}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      values.includes(String(opt.id))
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {opt.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {badges && !singleSelect && values.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 max-h-[100px] max-md:max-h-[50px] overflow-y-auto">
          {selectedLabels.map((label, index) => (
            <Badge key={index} variant="secondary">
              {label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
