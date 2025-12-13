"use client";
import Link from "next/link";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useMobile"
import "@/styles/components.css";

const Footer = () => {
  const isMobile = useIsMobile();
  return (
    <footer className='p-5 items-center text-center bottom-0 w-full flex flex-col'>
      <div className={isMobile ? 'm-1 flex flex-col justify-center space-y-4 align-items-center' : 'm-1 flex justify-center space-x-4 align-items-center'}>
        <Link href="/legals" rel="noopener noreferrer" className='mx-2 hover:underline font-light footer-link'>CGU</Link>
        <Link href="/legals" rel="noopener noreferrer" className='mx-2 hover:underline font-light footer-link'>Politique de confidentialité</Link>
        <Link href="/legals" rel="noopener noreferrer" className='mx-2 hover:underline font-light footer-link'>Mentions légales</Link>
        <Link href="mailto:project.mindchain+partner@gmail.com?subject=Partner%20info%20%3E%3E%3E" rel="noopener noreferrer" className='mx-2 hover:underline font-light footer-link'>Contact</Link>
        <div className={isMobile ? "flex space-x-4 justify-center" : "flex space-x-4 ml-6 justify-center"}>
          <Link href="https://x.com/Mindchain_" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/X_icon.svg" alt="x" width={30} height={30} className="gradient-arrow"/>
          </Link>
          <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/telegram_icon.svg" alt="telegram" width={30} height={30} className="gradient-arrow"/>
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/linkedin_icon.svg" alt="linkedin" width={30} height={30} className="gradient-arrow"/>
          </Link>
          <Link href="https://discord.gg/tNC9w8g8C2" target="_blank" rel="noopener noreferrer">
            <Image src="/icons/discord_icon.svg" alt="discord" width={30} height={30} className="gradient-arrow"/>
          </Link>
        </div>
      </div>
      <small className='text-gray-500 font-light'>&copy; Mindchain {new Date().getFullYear()}</small>
    </footer>
  )
}

export default Footer