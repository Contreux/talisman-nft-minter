# RMRK 1.0.0 Talisman NFT minting script

### Variable instructions

In the send-to-specific-addresses.ts file change two variables

1. `Constants`, change these for the specific collection and nft's you are making
   1a. make sure you pin the images for the nfts and update the image in the `ASSETS_CID` in constants.ts
2. `Numbers of nfts being minted`, update the current set of nfts you are minting, have left hard coded this is on line 100 of mint-talisman.ts `for (let i=3000; i<3334; i++){`

### Run Intructions

1. npm install
2. cd into ts -> run-files
   2a. Uncomment the await creation of collection if you haven't created it yet and are breaking
   up the minting into sections(for example the different kinds of commendations). Then comment it for any
   additional nfts being minted
3. run `npx ts-node ./run-mint-talisman-sequence.ts ` this will mint the nfts
