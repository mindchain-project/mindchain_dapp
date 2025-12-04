'use client';

import { useReadContract } from "wagmi";
import { USDTAbi } from "../../abi/USDTAbi";

const USDTAddress = "0x...";

export default function ReadUSDT() {
  const result = useReadContract({
    abi: USDTAbi,
    address: USDTAddress,
    functionName: "totalSupply",
  });

  return (
    <div>
      Total Supply : {result.toString() ?? "Loading..."}
    </div>
  );
}
