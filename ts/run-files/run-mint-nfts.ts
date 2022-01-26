import { mintTalismanNFT } from "../mint/mint-talisman";

export const runTalismanMintSequence = async () => {
  try {
    const nftsBlock = await mintTalismanNFT();
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(0);
  }
};

runTalismanMintSequence();
