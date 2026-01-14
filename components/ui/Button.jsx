import { cn } from "@/lib/utils";

export default function Button({
    children,
    className,
    variant = "primary",
    size = "md",
    ...props
}) {
    const variants = {
        primary: "bg-gold text-charcoal hover:bg-gold-light",
        outline: "border border-gold text-gold hover:bg-gold/10",
        ghost: "text-foreground hover:text-gold",
        white: "bg-white text-black hover:bg-gray-200",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(
                "rounded-none font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none tracking-wide uppercase",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
