# Solana Night Market
## About Solana Night Market[🔗](https://nightmarket.io/)
Unlike the auction house created by individual users, it is an open auction house, providing all users with the freedom to trade on it.

## NightmarketClient (`@motleylabs/mtly-nightmarket`)
[**NightmarketClient**](https://motleylabs.github.io/mtly-nightmarket/classes/NightmarketClient.html)

[**github**](https://github.com/motleylabs/mtly-nightmarket)

You can use the Night Market SDK to create the instructions required for the transaction, and since it supports lookup tables, the transaction type is `V0`.

### Create Listing
- `mint`: Mint address of the nft
- `price`: Price of the listing
- `seller`: Seller's wallet publickey
- `payer`: Signer(**seller**)

``` typescript
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
```

### Create Offer
- `mint`: Mint address of the nft
- `price`: Price of the listing
- `seller`: Seller's wallet publickey
- `buyer`: Buyer's wallet publickey
- `payer`: Signer(**buyer**)

``` typescript
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
```

### Close Listing
- `mint`: Mint address of the nft
- `seller`: Seller's wallet publickey
- `payer`: Signer(**seller**)

``` typescript
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
```

### Close Offer
- `mint`: Mint address of the nft
- `price`: Price of the listing
- `seller`: Seller's wallet publickey
- `buyer`: Buyer's wallet publickey
- `payer`: Signer(**buyer**)

``` typescript
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
```

### Get Listing & Offers
- `mint`: Mint address of the nft

``` typescript
const listing = await nmClient.GetListing(mint);
console.log('listing:', listing)

const offers = await nmClient.GetOffers(mint);
console.log('offers:', offers)
```

### Buy Listing
- `mint`: Mint address of the nft
- `price`: Price of the listing
- `seller`: Seller's wallet publickey
- `buyer`: Buyer's wallet publickey
- `payer`: Signer(**buyer**)

``` typescript
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
```
