import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DropdownMenu({ trigger, children, className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div className={cn(
          "absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover border border-border",
          "z-50 min-w-[8rem] overflow-hidden p-1",
          "animate-in fade-in-0 zoom-in-95",
          className
        )}>
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export function DropdownMenuItem({ 
  className, 
  children, 
  inset,
  ...props 
}: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "transition-colors focus:bg-accent focus:text-accent-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} />
  );
}

// Only export what we're using
export {
  type DropdownMenuProps,
  type DropdownMenuItemProps,
}