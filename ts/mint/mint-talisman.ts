import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "../utils/utils";
import {
  TALISMAN_COLLECTION_DESCRIPTION,
  TALISMAN_COLLECTION_MAX,
  TALISMAN_COLLECTION_NAME,
  TALISMAN_COLLECTION_SYMBOL,
  TALISMAN_COLLECTION_URL,
  TALISMAN_NFT_DESCRIPTION,
  WS_URL,
} from "../constants";
import { Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "../utils/pinata-utils";
import cowsay from 'cowsay';

// Create Talisman collection
export const createTalismanCollection = async () => {
  try {

    console.log("CREATE TALISMAN COLLECTION START -------");

    // Retreive signing credentials
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.MNEMONIC_PHRASE;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    // Instantiate Talisman collection 
    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      TALISMAN_COLLECTION_SYMBOL
    );

    // Instantiate collection cid (metadata)
    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/talisman-assets", // location of assets
      "Talisman-collection.png", // name of asset
      TALISMAN_COLLECTION_NAME, // name
      {
        description: TALISMAN_COLLECTION_DESCRIPTION, // Description of the collection
        external_url: TALISMAN_COLLECTION_URL, // Website of the collection
      }
    );

    // Instantiate items collection
    const ItemsCollection = new Collection(
      0, // Block 
      TALISMAN_COLLECTION_NAME, // Name 
      TALISMAN_COLLECTION_MAX, // Max number of nft's allowed in collection (Maximum 10,000)
      encodeAddress(accounts[0].address, 2), // issuer
      TALISMAN_COLLECTION_SYMBOL, // Ticker symbol by which to represent the token in wallets and platform UIs
      collectionId, // collection id
      collectionMetadataCid // collection metadata ipfs link
    )

    // Create and submit remark
    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.mint()), // remark tx 
      kp // keypair
    );
    console.log("TALISMAN COLLECTION CREATION REMARK: ", ItemsCollection.mint());
    console.log("Created at block: ", block);

    return block;
  } catch (error: any) {
    console.error(error);
  }
};

// Mint Talisman NFT
export const mintTalismanNFT = async () => {
  try {

    console.log("Talisman NFT begin -------");
    await cryptoWaitReady();
    
    // Retreive signing credentials
    const accounts = getKeys();                
    const ws = WS_URL;                          
    const phrase = process.env.MNEMONIC_PHRASE; 
    const kp = getKeyringFromUri(phrase);       

    // Instantiate CollectionID
    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      TALISMAN_COLLECTION_SYMBOL
    );

    // If you are breaking up the minting into sections make sure to only call this once
    // await createTalismanCollection(); // MINT Collection using RMRK1.0 (MINT Collection)
    
    const api = await getApi(ws);

    let promises = []

    // Iterate through nft's being minted
    for (let i=3000; i<3334; i++){
      const metadataCid = await pinSingleMetadataFromDir(
        "/talisman-assets",  // location of assets
        "spiritkey.png",  // name of asset
        `Spirit Key #${i}`,  // name of nft
        {
          description: TALISMAN_NFT_DESCRIPTION, // nft description
          external_url: "https://app.talisman.xyz", // website 
        }
      );

      // Instantiate nft
      const nft = new NFT(
        0, // block
        collectionId, // Collection ID
        `Spirit Key #${i}`, // nft name 
        `SPIRIT${i}`, // instance 
        1, // transferable 
        `${i}`.padStart(8, "0"), // serial number
        metadataCid, // metadata 
      )
      promises = promises.concat(nft.mintnft())
    }

    const remarks = await Promise.all(promises);

    // map promises to transactions
    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batchAll(txs);
    const { block } = await sendAndFinalize(tx, kp); // send and finalise tx

    // personal touch cause I like it
    console.log(cowsay.say({
      text: `You minted Talisman NFTs at block ${block}`,
      e: 'oO',
      T: 'U'
    }));
    
    return block;
  } catch (error: any) {
    console.error(error);
  }
};
