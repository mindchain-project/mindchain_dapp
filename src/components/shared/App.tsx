import { MINDCHAIN_NFT_ADDRESS, MINDCHAIN_NFT_ABI } from "@contracts/index";
import { useReadContract } from "wagmi";

function App() {
  const result = useReadContract({
    abi: MINDCHAIN_NFT_ABI[0].abi,
    address: MINDCHAIN_NFT_ADDRESS,
    functionName: "totalSupply",
  });
  console.log("Total Supply:", result.data);
  return result.data;
}