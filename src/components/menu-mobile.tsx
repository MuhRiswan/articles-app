import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

type NavigationItem = {
  name: string;
  href: string;
};

type MobileMenuProps = {
  navigationItems: NavigationItem[];
};

const MobileMenu = ({ navigationItems }: MobileMenuProps) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="hover:bg-accent">
          <Menu className="w-5 h-5 text-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pt-12">
        <div className="mt-5 flex px-2 space-y-1 flex-col">
          {navigationItems.map((item) => (
            <Link key={item.name} href={item.href} className={cn("group flex items-center rounded-md p-3 text-sm font-medium transition-colors", isActive(item.href) ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-accent/50 hover:text-foreground")}>
              {item.name}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
