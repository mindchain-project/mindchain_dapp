import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import Image from "next/image";
import { 
  AppKitButton, 
  AppKitNetworkButton 
} from "@reown/appkit/react";

export default function ConnectButton() {
    const { open } = useAppKit();
    const { isConnected } = useAppKitAccount();
 return (
    <>
        {isConnected ? (
            <div className="flex items-center space-x-2">
                <AppKitButton namespace="eip155"/>
                <AppKitNetworkButton />
                <Image src="/icons/checked_icon.svg" alt="checked_icon" width={30} height={30} />
            </div>
        ) : (
            <>
            <button className="menu-button btn-action" onClick={() => open()}>Se connecter</button>
            </>
        )}
    </>
    );
}