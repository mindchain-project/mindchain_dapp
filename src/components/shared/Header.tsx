'use client';
import Link from "next/link";
import Image from "next/image";
import "@/styles/components.css";
import { NavigationMenuHeader } from "@/components/shared/NavigationMenuHeader";
import ConnectButton from "./ConnectButton";

const Header = () => {
  return (
    <header>
      <div className="logo-header">
        <Link href="/" className="logo">
          <Image src="/logo_brain_gradient.png" alt="MindChain Logo" width={100} height={100} />
          <Image src="/logo_baseline_gradient.png" alt="MindChain Baseline" width={200} height={100} />
        </Link>
      </div>
      <NavigationMenuHeader />
      <ConnectButton />
    </header>
    );
};
export default Header;


