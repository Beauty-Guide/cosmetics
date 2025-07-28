import { useLocation, Link } from "react-router"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"

const hiddenBreadcrumbs = ["category"]

export default function Breadcrumbs() {
  const { t } = useTranslation()
  const location = useLocation()

  const pathnames = location.pathname
    .split("/")
    .filter((segment) => segment !== "")

  const breadcrumbs = useMemo(
    () => [
      { name: t("main"), to: "/" },
      ...pathnames.map((segment, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/")

        switch (segment) {
          case "product":
            return {
              name: t("breadcrumb.product"),
              to: "/",
            }
          case "favorites":
            return {
              name: t("breadcrumb.favorites"),
              to: "/favorites",
            }
          case "analytics":
            return {
              name: t("breadcrumb.analytics"),
              to: "/analytics",
            }
          case "cosmetic-bag":
            return {
              name: t("cosmetic-bag"),
              to: "/cosmetic-bag",
            }
        }

        if (segment.startsWith("cosmeticBag_")) {
          return {
            name: "Cosmetic-Bag",
            to,
          }
        }

        return {
          name: decodeURIComponent(segment),
          to,
        }
      }),
    ],
    [pathnames, t]
  )

  const filteredBreadcrumbs = useMemo(() => {
    return breadcrumbs.filter(
      (crumb) => !hiddenBreadcrumbs.includes(crumb.name)
    )
  }, [breadcrumbs])

  return (
    <Breadcrumb className="sticky top-0 z-10 shadow-md py-3 px-sides rounded-b-md bg-white">
      <BreadcrumbList>
        {filteredBreadcrumbs.map((crumb, index) => {
          const isLast = index === filteredBreadcrumbs.length - 1

          return (
            <Fragment key={crumb.name + index}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  {isLast ? (
                    <span className="font-medium text-muted-foreground">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="text-primary hover:underline"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
