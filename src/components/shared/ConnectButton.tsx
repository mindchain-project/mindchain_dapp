import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import { 
  AppKitButton, 
  AppKitNetworkButton 
} from "@reown/appkit/react";
import { useState } from "react";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (connecting) return;

    try {
      setConnecting(true);
      await open();   
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <AppKitButton namespace="eip155" />
          <AppKitNetworkButton />
          <Image src="/icons/checked_icon.svg" alt="checked_icon" width={30} height={30} />
        </div>
      ) : (
        <button className="menu-button btn-action" onClick={handleConnect} disabled={connecting}>
          {connecting ? "Connexion..." : "Se connecter"}
        </button>
      )}
    </>
  );
}
