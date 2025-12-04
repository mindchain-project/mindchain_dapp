'use client';
import { useAppKitAccount } from "@reown/appkit/react";
import NavigationStudioTabs, { type StudioTabKey } from "@/components/shared/navigation/NavigationStudioTabs";
import { useState } from "react";
import History from './history';
import Certification from './certification';
import Generation from './generation';

const Studio = () => {
  const { address, isConnected } = useAppKitAccount();
  const [activeTab, setActiveTab] = useState<StudioTabKey>("certification");
  if (!isConnected) {
    return (
    <>
      <h2 className='studio highlight'>Studio</h2>
      <div className="space-y-4 text-center text-muted-foreground mt-30 mb-30">Connectez votre portefeuille pour accéder au studio.</div>
    </>
      );
  }
  return (
    <>
      <h2 className='studio highlight'>Studio</h2>
      <NavigationStudioTabs defaultTab={activeTab} onChange={setActiveTab} />
      <div className="pt-10 pb-10 w-full">
        {activeTab === "generation" && (
          <Generation address={address || ""} />
        )}
        {activeTab === "certification" && (
          <Certification address={address || ""} model="defaultModel" />
        )}
        {activeTab === "history" && (
          <History address={address || ""} />
        )}
        {activeTab === "pricing" && (
          <section className="space-y-4 justify-self-center">
            <h3 className="text-xl font-semibold">Tarifs</h3>
            <p className="text-muted-foreground">Choisissez votre offre adaptée à vos besoins.</p>
          </section>
        )}
        {activeTab === "faq" && (
          <section className="space-y-4 justify-self-center">
            <h3 className="text-xl font-semibold">FAQ</h3>
            <p className="text-muted-foreground">Réponses aux questions fréquentes.</p>
          </section>
        )}
      </div>
    </>
  )
}

export default Studio