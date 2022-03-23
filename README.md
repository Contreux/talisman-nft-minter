# RMRK 1.0.0 Talisman NFT minting script by Contreux

## Technology Stack & Tools

- Typescript (Writing Smart Contract)
- [pinata](https://docs.pinata.cloud/) (IPFS Pinning Service)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [RMRK Tools](https://github.com/rmrk-team/rmrk-tools) (RMRK API)

### Variable instructions

In the send-to-specific-addresses.ts file change two variables

1. `Constants`, change these for the specific collection and nft's you are making
   a. make sure you pin the images for the nfts and update the image in the `ASSETS_CID` in constants.ts\
   b. To pin the images use a service like pinata so that they don't get dropped from IPFS
2. `Numbers of nfts being minted`, update the current set of nfts you are minting, have left hard coded this is on line 100 of mint-talisman.ts `for (let i=3000; i<3334; i++){`

### Run Intructions

1. npm install
2. cd into ts -> run-files // TODO: Break into two functions Create collection, save collection, then mint nft's
   a. Uncomment the await creation of collection if you haven't created it yet and are breaking
   up the minting into sections(for example the different kinds of commendations). Then comment it for any
   additional nfts being minted
3. run `npx ts-node ./run-mint-talisman-sequence.ts ` this will mint the nfts
