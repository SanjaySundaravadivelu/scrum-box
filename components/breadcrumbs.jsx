import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Breadcrumb({ items, className }) {
  return (
    <nav
      className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight />}
          {item.href && !item.active ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
