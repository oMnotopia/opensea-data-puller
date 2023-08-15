//Function takes an array of the unix dates for the Opensea data set and searches through an array of datapoints for historical crypto prices.
//When the Opensea date matches with the historical prices it adds that value to a new array.
function MapEpochTimesToPrices(listOfEpochTimes, orderedEpochTimesFromCC) {
  let windowPointer = 0;
  let historicCryptoPrices = [];
  //Loop for items in Opensea state
  for (let OSitem = 0; OSitem < listOfEpochTimes.length; OSitem++) {
    //Loop for items in Crypto Compare array
    for (
      let CCitem = windowPointer;
      CCitem < orderedEpochTimesFromCC.length;
      CCitem++
    ) {
      if (
        CCitem === 0 &&
        listOfEpochTimes[OSitem] > orderedEpochTimesFromCC[CCitem].time
      ) {
        historicCryptoPrices.push(
          (orderedEpochTimesFromCC[CCitem].high +
            orderedEpochTimesFromCC[CCitem].low) /
            2
        );
        break;
      } else if (
        listOfEpochTimes[OSitem] < orderedEpochTimesFromCC[CCitem].time &&
        listOfEpochTimes[OSitem] > orderedEpochTimesFromCC[CCitem + 1].time
      ) {
        historicCryptoPrices.push(
          (orderedEpochTimesFromCC[CCitem].high +
            orderedEpochTimesFromCC[CCitem].low) /
            2
        );
        break;
      }

      windowPointer++;
    }
  }

  return historicCryptoPrices;
}

export default MapEpochTimesToPrices;
