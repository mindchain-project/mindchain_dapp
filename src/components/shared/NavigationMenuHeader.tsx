"use client"
import Link from "next/link"
import { useIsMobile } from "@/hooks/useMobile"
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import "@/styles/components.css";

export const NavigationMenuHeader = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `navigation-menu-item ${pathname === href ? "active" : ""}`;

  return (
    <div className="navigation-menu-header">
      <NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex-wrap align-center justify-center">

          <NavigationMenuItem className={linkClasses("/")}>
            <Link href="/">Produit</Link>
          </NavigationMenuItem>

          <NavigationMenuItem className={linkClasses("/technology")}>
            <Link href="/technology">Technologie</Link>
          </NavigationMenuItem>

          <NavigationMenuItem className={linkClasses("/protocol")}>
            <Link href="/protocol">Protocole</Link>
          </NavigationMenuItem>

          <NavigationMenuItem className={linkClasses("/whitepaper")}>
            <Link href="/whitepaper">Livre blanc</Link>
          </NavigationMenuItem>
          <NavigationMenuItem className={linkClasses("/studio")}>
            <Link href="/studio">Studio</Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
