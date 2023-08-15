import axios from "axios";

//Get Daily prices from Crypto Compare using their API.
//Make an API call for each data point and return the price in Canadian dollars.
async function CryptoComapreAPICall() {
  let orderedEpochTimesFromCC;

  try {
    const ENDPOINT = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=CAD&limit=1000&aggregate=1&extraParams=AccountingFun`;

    const resp = await axios.get(ENDPOINT);

    //dates need to be reversed so that the most recent events are first in the array.
    //This is so that it lines up with the dates retrieved from the Opensea API call.
    orderedEpochTimesFromCC = resp.data.Data.Data.reverse();
  } catch (err) {
    console.log(err);
  }

  return orderedEpochTimesFromCC;
}

export default CryptoComapreAPICall;
