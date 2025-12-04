"use client";
import { useState } from "react";

const tabs = [
  { key: "certification", label: "Certification" },
  { key: "generation", label: "Génération" },
  { key: "history", label: "Historique" },
  { key: "pricing", label: "Tarifs" },
  { key: "faq", label: "FAQ" },
];

export type StudioTabKey = typeof tabs[number]["key"]; 

export default function NavigationStudioTabs({
  defaultTab = "account",
  onChange,
}: {
  defaultTab?: StudioTabKey;
  onChange?: (key: StudioTabKey) => void;
}) {
  const [active, setActive] = useState<StudioTabKey>(defaultTab);

  const handleClick = (key: StudioTabKey) => {
    setActive(key);
    onChange?.(key);
  };

  return (
    <div className="navigation-studio-header">
      <div className="navigation-studio-header-list flex flex-wrap items-center justify-center gap-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleClick(t.key)}
            className={`navigation-studio-item btn-tab px-3 py-2 rounded-md relative
            ${
                active === t.key
                ? "text-sm text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] to-[#7e2cff] after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[3px] after:bg-gradient-to-r after:from-[#00d4ff] after:to-[#7e2cff] after:rounded-full"
                : "text-sm text-foreground hover:text-[#00d4ff]"
            }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 my-1 rounded" />
    </div>
  );
}
