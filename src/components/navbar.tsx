"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import MobileMenu from "./menu-mobile";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { useAuthStore } from "@/lib/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const logout = () => {
    deleteCookie("token");
    useAuthStore.getState().clearUser();
    router.push("/login");
    router.refresh();
  };

  const navigationItems = [
    {
      name: "Home",
      href: "/",
    },
    // {
    //   name: "About",
    //   href: "/about",
    // },
    // {
    //   name: "Projects",
    //   href: "/projects",
    // },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (href: string) => {
    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  return (
    <div className={cn("w-full fixed top-0 inset-x-0 transition-all duration-300 z-50", isScrolled ? "bg-background/90 backdrop-blur-sm shadow-sm border-b" : "bg-transparent")}>
      <div className="flex container items-center justify-between mx-auto px-4 md:px-8 py-4 ">
        <div className="hidden md:flex justify-center items-center ">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-foreground/80 hover:text-foreground hover:bg-accent/50", isActive(item.href) && "bg-accent text-accent-foreground")}>{item.name}</NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center justify-between  lg:justify-end w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage sizes="" src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {/* <div className="text-right"> */}
              <p className="text-right text-sm font-medium leading-none">{user?.username || "User"}</p>
              {/* <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs leading-none text-muted-foreground">{user?.email}</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-white hover:text-accent-foreground" onSelect={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="md:hidden">
            <MobileMenu navigationItems={navigationItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
