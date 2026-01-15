"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const cardButtonVariants = cva(
    "cursor-pointer inline-flex items-center justify-center rounded transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    {
        variants: {
            variant: {
                default: "bg-background",
            },
            size: {
                default: "p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface CardButtonProps
    extends React.ComponentProps<"button">,
    VariantProps<typeof cardButtonVariants> {
    asChild?: boolean
    icon: string
    title: string
    description: string
    children?: React.ReactNode
}

function CardButton({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    icon,
    title,
    description,
    children,
    ...props
}: Readonly<CardButtonProps>) {
    const Comp = asChild ? Slot : "button"

    const [isHovered, setIsHovered] = useState(false)

    const cardContent = (
        <div className="relative" >
            <div className="flex items-center justify-center min-w-full min-h-64 max-h-64 overflow-hidden">
                <img src={icon} alt={title} className="w-full min-h-64 object-cover" />
            </div>
            <div className={cn("text-left flex flex-col items-start justify-start absolute bottom-0 left-0 w-full h-full p-5 shadow-lg transition-colors duration-300", isHovered && "bg-background")}>
                <h3 className={cn("p-2 border-l-2 border-primary text-h3 font-regular text-foreground", isHovered ? "underline" : "bg-background/95")}>{title}</h3>
                <p className={cn("p-2 text-caption text-foreground opacity-0 transition-opacity duration-300 mt-6 font-regular", isHovered && "opacity-100")}>{description}</p>
                <div className={cn("absolute bottom-5 right-5 p-2", isHovered ? "bg-transparent" : "bg-background rounded-full shadow-lg")}>
                    <ArrowRight className="w-6 h-6 text-primary" />
                </div>
            </div>
        </div>
    )

    if (asChild) {
        if (!React.isValidElement(children)) {
            throw new Error('CardButton with asChild requires a single React element as a child')
        }
        
        const childElement = children as React.ReactElement
        
        return (
            <Comp
                data-slot="card-button"
                data-variant={variant}
                data-size={size}
                className={cn("w-full min-w-[281px]", cardButtonVariants({ variant, size, className }))}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                {...props}
            >
                {React.cloneElement(childElement, {}, cardContent)}
            </Comp>
        )
    }

    return (
        <Comp
            data-slot="card-button"
            data-variant={variant}
            data-size={size}
            className={cn("w-full min-w-[281px]", cardButtonVariants({ variant, size, className }))}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {cardContent}
        </Comp>
    )
}

export { CardButton }

