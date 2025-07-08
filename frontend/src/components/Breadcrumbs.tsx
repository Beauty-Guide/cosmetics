import { useLocation, Link } from "react-router"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

export default function Breadcrumbs() {
  const { t } = useTranslation()
  const location = useLocation()

  const pathnames = location.pathname
    .split("/")
    .filter((segment) => segment !== "")

  const breadcrumbs = [
    { name: t("main"), to: "/" },
    ...pathnames.map((segment, index) => {
      const to = "/" + pathnames.slice(0, index + 1).join("/")

      switch (segment) {
        case "category":
          return {
            name: t("breadcrumb.category"),
            to: "/",
          }
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
      }

      return {
        name: decodeURIComponent(segment),
        to,
      }
    }),
  ]

  return (
    <Breadcrumb className="my-5 shadow-md rounded-md py-3 px-sides bg-white">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

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
