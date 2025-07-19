import { getImgUrl } from "@/lib/utils"
import type { TImage } from "@/types"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState } from "react"

type TImageCarouselProps = {
  images: TImage[]
}

export function ImageCarousel({ images }: TImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  const scrollTo = (index: number) => {
    if (!emblaApi) return
    emblaApi.scrollTo(index)
  }

  return (
    <div className="w-full max-w-xl">
      <div className="overflow-hidden rounded-md" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div className="min-w-0 flex-[0_0_100%]" key={img.id}>
              <img
                src={getImgUrl(img.url)}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      <span className="flex gap-2 my-2 overflow-hidden">
        {images.map((img, index) => (
          <img
            src={getImgUrl(img.url)}
            key={img.id}
            onClick={() => scrollTo(index)}
            alt={`Thumbnail ${index + 1}`}
            className={`w-25 select-none object-cover cursor-pointer rounded-md border-2 transition max-md:w-16
              ${
                selectedIndex === index
                  ? "border-primary"
                  : "border-transparent opacity-50 hover:opacity-100"
              }`}
          />
        ))}
      </span>
    </div>
  )
}
