//Extracts data from Opensea API response to a manageable and useful object conataining only necessary information.
//Also merges Crypto Compare API data into object.
function MapPricesToOSData(OSdata, historicCryptoPrices) {
  let newData;
  let CSVData = OSdata.map((item, index) => {
    if (item.asset === null) {
      newData = {
        price: item.total_price / 10 ** item.payment_token.decimals,
        price_in_cad:
          historicCryptoPrices[index] *
          (item.total_price / 10 ** item.payment_token.decimals),
        date_of_sale: item.event_timestamp,
        token_type: item.payment_token.name,
        collection_slug: item.collection_slug,
        transaction_hash: item.transaction.transaction_hash,
        seller: item.seller.address,
        buyer: item.winner_account.address,
        contract_address: item.contract_address,
      };
    } else {
      newData = {
        price: item.total_price / 10 ** item.payment_token.decimals,
        price_in_cad:
          historicCryptoPrices[index] *
          (item.total_price / 10 ** item.payment_token.decimals),
        date_of_sale: item.event_timestamp,
        token_type: item.payment_token.name,
        opensea_percentage:
          item.asset.collection.opensea_seller_fee_basis_points / 100,
        opensea_price:
          (item.asset.collection.opensea_seller_fee_basis_points / 10000) *
          (historicCryptoPrices[index] *
            (item.total_price / 10 ** item.payment_token.decimals)),
        seller_percentage:
          item.asset.collection.dev_seller_fee_basis_points / 100,
        seller_royalty:
          (item.asset.collection.dev_seller_fee_basis_points / 10000) *
          (historicCryptoPrices[index] *
            (item.total_price / 10 ** item.payment_token.decimals)),
        collection_slug: item.collection_slug,
        transaction_hash: item.transaction.transaction_hash,
        seller: item.seller.address,
        buyer: item.winner_account.address,
        contract_address: item.contract_address,
      };
    }

    return newData;
  });

  return CSVData;
}

export default MapPricesToOSData;
