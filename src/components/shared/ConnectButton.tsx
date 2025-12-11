import { useAppKit, useAppKitAccount, useAppKitProvider, AppKitButton } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import { isUserAdmin } from "@/services/contract";
import Image from "next/image";
import Link from "next/link";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [connecting, setConnecting] = useState(false);
  const [ adminStatus, setAdminStatus ] = useState<boolean>(true);
  const { walletProvider: walletProvider } = useAppKitProvider("eip155");

  const handleConnect = async () => {
    if (connecting) return;

    try {
      setConnecting(true);
      await open();   
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const checkAdmin = async () => {
        const result = await isUserAdmin(walletProvider);
        setAdminStatus(result);
      };
      checkAdmin();
    }
  }, [isConnected, walletProvider]);


  return (
    <>
      {isConnected ? (
        <div className="flex flex-col md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
          {adminStatus === true && (
            <button 
              type="submit" 
              className="btn-action text-white-500 align-right"
            ><Link href="/admin">Administrateur</Link></button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <AppKitButton namespace="eip155" />
          <Image src="/icons/checked_icon.svg" alt="checked_icon" width={30} height={30} />
        </div>
        </div>
      ) : (
        <button className="menu-button btn-action" onClick={handleConnect} disabled={connecting}>
          {connecting ? "Connexion..." : "Se connecter"}
        </button>
      )}
    </>
  );
}
