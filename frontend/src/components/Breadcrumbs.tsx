import { useLocation, Link } from "react-router"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"

export default function Breadcrumbs() {
  const location = useLocation()

  const pathnames = location.pathname
    .split("/")
    .filter((segment) => segment !== "")

  const breadcrumbs = [
    { name: "Главная", to: "/" },
    ...pathnames.map((segment, index) => {
      const to = "/" + pathnames.slice(0, index + 1).join("/")

      switch (segment) {
        case "category":
          return {
            name: "Каталог",
            to: "/",
          }
        case "product":
          return {
            name: "Товары",
            to: "/",
          }
      }

      return {
        name: decodeURIComponent(segment),
        to,
      }
    }),
  ]

  return (
    <Breadcrumb className="m-5">
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1

          return (
            <Fragment key={crumb.to}>
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
