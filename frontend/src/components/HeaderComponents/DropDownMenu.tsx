import { memo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User2Icon } from "lucide-react"
import { Button } from "../ui/button"
import type { TProduct, TUser } from "@/types"
import { useTranslation } from "react-i18next"

type TDropDownMenuProps = {
  handleNagivate: (path: string) => void
  user: TUser | null
  favorites: TProduct[]
  isAdmin: boolean
  isAuthenticated: boolean
  handleLogout: () => void
  handleLogin: () => void
}

const DropDownMenu = ({
  handleNagivate,
  user,
  isAdmin,
  isAuthenticated,
  handleLogout,
  handleLogin,
  favorites,
}: TDropDownMenuProps) => {
  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full p-0 max-md:bg-white max-md:w-12 max-md:h-12"
        >
          <User2Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel className="font-bold select-none">
          {t("my_account")} {`(${user?.name})`}
        </DropdownMenuLabel>
        {isAdmin && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t("ADMIN")}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col p-2 gap-2">
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/cosmetic")}
                >
                  {t("nav.cosmetic")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/catalog")}
                >
                  {t("nav.catalogs")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/brand")}
                >
                  {t("nav.brands")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/skinType")}
                >
                  {t("nav.skinTypes")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/action")}
                >
                  {t("nav.actions")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-black hover:text-blue-900 text-sm transition-colors px-2 py-1.5 outline-hidden"
                  onClick={() => handleNagivate("/admin/ingredient")}
                >
                  {t("nav.ingredients")}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )}
        <DropdownMenuSeparator />
        {isAuthenticated && (
          <DropdownMenuGroup className="max-sm:hidden">
            <DropdownMenuItem onClick={() => handleNagivate("/favorites")}>
              {t("favorites")}
              <DropdownMenuShortcut>{favorites?.length}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        {isAuthenticated && (
          <DropdownMenuGroup className="max-sm:hidden">
            <DropdownMenuItem onClick={() => handleNagivate("/cosmetic-bag")}>
              {t("cosmetic-bag")}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>{t("lang")}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("en")}>
                EN
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("ru")}>
                RU
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => i18n.changeLanguage("ko")}>
                KO
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {isAuthenticated ? (
          <DropdownMenuItem onClick={handleLogout}>
            {t("logout")}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={handleLogin}>
            {t("login")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default memo(DropDownMenu)
