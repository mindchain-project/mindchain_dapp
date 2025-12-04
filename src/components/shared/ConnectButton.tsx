import { useAppKit, useAppKitAccount } from "@reown/appkit/react";

export default function ConnectButton() {
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
 return (
    <>
        {isConnected ? (
            <appkit-button />
        ) : (
            <button className="menu-button" onClick={() => open()}>Se connecter</button>
        )}
    </>
    );
}