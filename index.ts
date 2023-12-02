import { Connection, clusterApiUrl, Keypair, TransactionMessage, VersionedTransaction, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import { NightmarketClient } from '@motleylabs/mtly-nightmarket'
import dotenv from "dotenv"
import bs58 from 'bs58'
dotenv.config()

const connection = new Connection(clusterApiUrl("devnet"));
const nmClient = new NightmarketClient(clusterApiUrl('devnet'));
console.log(nmClient)

async function connectWallet(connection: Connection): Promise<Keypair> {
    // Use dotenv to get project and directory variables
    require('dotenv').config();

    // console.log("PRIVATE_KEY from env:", process.env.PRIVATE_KEY);
    const payerSecret = process.env.PRIVATE_KEY || "";
    const payerSecretKey = bs58.decode(payerSecret);
    const payer = Keypair.fromSecretKey(payerSecretKey);

    console.log(payer.publicKey.toBase58())
    return payer;
}

async function connectBuyerWallet(connection: Connection): Promise<Keypair> {
    // Use dotenv to get project and directory variables
    require('dotenv').config();

    // console.log("PRIVATE_KEY from env:", process.env.PRIVATE_KEY);
    const buyPayerSecret = process.env.BUYER_PRIVATE_KEY || "";
    const buyPayerSecretKey = bs58.decode(buyPayerSecret);
    const buyPayer = Keypair.fromSecretKey(buyPayerSecretKey);

    console.log(buyPayer.publicKey.toBase58())
    return buyPayer;
}

async function createListing(mint: PublicKey, price: number, seller: PublicKey, payer: Keypair) {
    const createListingAction = await nmClient.CreateListing(mint, price, seller);
    if (!!createListingAction.err) {
        throw createListingAction.err;
    }

    const latestBlockhash = await connection.getLatestBlockhash('finalized');

    const messageV0 = new TransactionMessage({
        payerKey: seller,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: createListingAction.instructions,
    }).compileToV0Message(createListingAction.altAccounts);
    console.log("   ✅ - Compiled transaction message");

    const transactionV0 = new VersionedTransaction(messageV0);
    console.log(transactionV0)

    transactionV0.sign([payer]);
    console.log("   ✅ - Transaction Signed");

    const txid = await connection.sendTransaction(transactionV0)

    await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

async function closeListing(mint: PublicKey, seller: PublicKey, payer: Keypair) {
    const closeListingAction = await nmClient.CloseListing(mint, seller);
    if (!!closeListingAction.err) {
        throw closeListingAction.err;
    }

    const latestBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: seller,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: closeListingAction.instructions,
    }).compileToV0Message(closeListingAction.altAccounts);

    const transactionV0 = new VersionedTransaction(messageV0);
    console.log(transactionV0)

    transactionV0.sign([payer]);
    console.log("   ✅ - Transaction Signed");

    const txid = await connection.sendTransaction(transactionV0)

    await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

async function createOffer(mint: PublicKey, price: number, seller: PublicKey, buyer: PublicKey, payer: Keypair) {
    const createOfferAction = await nmClient.CreateOffer(mint, price, seller, buyer);
    if (!!createOfferAction.err) {
        throw createOfferAction.err;
    }

    const latestBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: buyer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: createOfferAction.instructions,
    }).compileToV0Message();
    console.log("   ✅ - Compiled transaction message");

    const transactionV0 = new VersionedTransaction(messageV0);
    console.log(transactionV0)

    transactionV0.sign([payer]);
    console.log("   ✅ - Transaction Signed");

    const txid = await connection.sendTransaction(transactionV0)

    await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

async function closeOffer(mint: PublicKey, price: number, seller: PublicKey, buyer: PublicKey, payer: Keypair) {
    const closeOfferAction = await nmClient.CloseOffer(mint, price, seller, buyer);
    if (!!closeOfferAction.err) {
        throw closeOfferAction.err;
    }

    const latestBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: buyer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: closeOfferAction.instructions,
    }).compileToV0Message();

    const transactionV0 = new VersionedTransaction(messageV0);
    console.log(transactionV0)

    transactionV0.sign([payer]);
    console.log("   ✅ - Transaction Signed");

    const txid = await connection.sendTransaction(transactionV0)

    await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

async function buyListing(mint: PublicKey, price: number, seller: PublicKey, buyer: PublicKey, payer: Keypair) {
    const buyListingAction = await nmClient.BuyListing(mint, price, seller, buyer);
    if (!!buyListingAction.err) {
        throw buyListingAction.err;
    }

    const latestBlockhash = await connection.getLatestBlockhash();
    const messageV0 = new TransactionMessage({
        payerKey: buyer,
        recentBlockhash: latestBlockhash.blockhash,
        instructions: buyListingAction.instructions,
    }).compileToV0Message(buyListingAction.altAccounts);
    console.log("   ✅ - Compiled transaction message");

    const transactionV0 = new VersionedTransaction(messageV0);
    console.log(transactionV0)

    transactionV0.sign([payer]);
    console.log("   ✅ - Transaction Signed");

    const txid = await connection.sendTransaction(transactionV0)

    await connection.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
    })

    console.log('🎉 Transaction succesfully confirmed!', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

async function main() {
    const payer = await connectWallet(connection)
    const buyPayer = await connectBuyerWallet(connection)

    const mint = new PublicKey('5YuSwuohabv1jbMkUNDzRExY7FyaW8ozehXrqKQ7os8b')//'B9n63fnyBQtRauTFrZEkMFFKDbTaUJ1RKBiRRhhJTgjq')
    const price = 0.00001
    const seller = payer.publicKey//new PublicKey('846HwwmSGguDbipzs2xDYCsfyhi4j2LLiuQri11woums')

    // await createListing(mint, price, seller, payer)

    // const listing = await nmClient.GetListing(mint);
    // console.log('listing:', listing)

    // closeListing(mint, seller, payer)

    const buyer = buyPayer.publicKey//new PublicKey('8Z17Y623ZjNV8xaAdxgn5ZkqkVTEo8Yc6uaapvcrFB62')
    // createOffer(mint, price, seller, buyer, buyPayer)

    // const offers = await nmClient.GetOffers(mint);
    // console.log('offers:', offers)

    // buyListing(mint, price, seller, buyer, buyPayer)
}

main()