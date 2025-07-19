import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
    label?: string
    showValueLabel?: boolean
}

function Slider({
                    className,
                    defaultValue,
                    value: propsValue,
                    min = 0,
                    max = 100,
                    label,
                    showValueLabel = true,
                    onValueChange,
                    ...props
                }: SliderProps) {
    // Объединяем логику значения: управляемый или неуправляемый компонент
    const [uncontrolledValue, setUncontrolledValue] = React.useState<number[]>(
        () => {
            if (Array.isArray(propsValue)) return propsValue
            if (Array.isArray(defaultValue)) return defaultValue
            return [min]
        }
    )

    const isControlled = propsValue !== undefined
    const value = isControlled ? propsValue : uncontrolledValue

    const handleChange = React.useCallback(
        (newValue: number[]) => {
            if (!isControlled) {
                setUncontrolledValue(newValue)
            }
            onValueChange?.(newValue)
        },
        [isControlled, onValueChange]
    )

    // Если значение пришло не как массив, делаем его массивом
    const safeValue = React.useMemo(() => {
        return Array.isArray(value) ? value : [value]
    }, [value])

    return (
        <div className="flex items-center gap-2 w-full">
            {/* Лейбл слева */}
            {label && (
                <span className="whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
            )}

            <SliderPrimitive.Root
                data-slot="slider"
                min={min}
                max={max}
                step={1}
                value={safeValue}
                onValueChange={handleChange}
                className={cn(
                    "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
                    className
                )}
                {...props}
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className={cn(
                        "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
                    )}
                >
                    <SliderPrimitive.Range
                        data-slot="slider-range"
                        className={cn(
                            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                        )}
                    />
                </SliderPrimitive.Track>

                {/* Рендер thumbs */}
                {safeValue.map((val, index) => (
                    <React.Fragment key={index}>
                        <SliderPrimitive.Thumb
                            data-slot="slider-thumb"
                            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                        />
                        {/* Отображение значения над thumb */}
                        {showValueLabel && (
                            <span
                                className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-1 py-0.5 text-xs font-medium text-white pointer-events-none"
                                style={{ left: `${((val - min) / (max - min)) * 100}%` }}
                            >
                {val}
              </span>
                        )}
                    </React.Fragment>
                ))}
            </SliderPrimitive.Root>
        </div>
    )
}

export { Slider }