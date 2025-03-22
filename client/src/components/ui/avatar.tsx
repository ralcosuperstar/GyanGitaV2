import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
}

export function Avatar({ src, alt, className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {alt?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  )
}