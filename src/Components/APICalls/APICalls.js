import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import axios from "axios";
import "./APICalls.css";
import CryptoComapreAPICall from "./CryptoComapreAPICall";
import MapEpochTimesToPrices from "./MapEpochTimesToPrices";
import MapPricesToOSData from "./MapPricesToOSData";

//Headers for the AXIOS API call
const config = {
  headers: {
    "X-API-KEY": process.env.OPENSEA_API_KEY,
  },
};

//Titles for columns in CSV files.
const CSVHeaders = [
  {
    label: "Price",
    key: "price",
  },
  {
    label: "Price in CAD",
    key: "price_in_cad",
  },
  {
    label: "Date of Sale",
    key: "date_of_sale",
  },
  {
    label: "Token Type",
    key: "token_type",
  },
  {
    label: "Opensea Percentage",
    key: "opensea_percentage",
  },
  {
    label: "Opensea Price Amount",
    key: "opensea_price",
  },
  {
    label: "Seller Percentage",
    key: "seller_percentage",
  },
  {
    label: "Seller Royalty Amount",
    key: "seller_royalty",
  },
  {
    label: "Slug (Collection Name)",
    key: "collection_slug",
  },
  {
    label: "Transaction Hash",
    key: "transaction_hash",
  },
  {
    label: "Seller ID",
    key: "seller",
  },
  {
    label: "Purchaser ID",
    key: "buyer",
  },
  {
    label: "Contract Address",
    key: "contract_address",
  },
];

//Global Variables
let historicCryptoPrices = [];
let openseaAPIData = [];

const APICalls = ({ filteringState, infoSubmit, setInfoSubmit }) => {
  //Initialize states for data, pageload, and cursor(for pagination)
  const [pageCursor, setPageCursor] = useState("");
  const [content, setContent] = useState("");

  //Makes API call to Opensea with the use entered filtering info, then calls function to handle response
  const getData = async () => {
    try {
      const ENDPOINT = `https://api.opensea.io/api/v1/events?account_address=${filteringState.wAddress}&event_type=${filteringState.eventType}&occurred_before=${filteringState.endDate}&occurred_after=${filteringState.startDate}&cursor=${pageCursor}`;

      const resp = await axios.get(ENDPOINT, config);
      console.log(resp);
      responseFucntion(resp);
    } catch (err) {
      console.log(err);
    }
  };

  //Handle response function.
  //Updates state with data, the next cursor and when API calls are finished calls function to map data.
  const responseFucntion = async (res) => {
    if (res.data) {
      console.log("adding data");
      openseaAPIData.push(res.data.asset_events);
      console.log(openseaAPIData);
      if (res.data.next) {
        setPageCursor(res.data.next);
      } else {
        //Get array of historical prices from Crypto Compare API call.
        const CCAPIData = await CryptoComapreAPICall();

        //If the Opensea API call has finished flatten data and get historic crypto prices.
        const flatData = openseaAPIData.flat(1);
        //Turns the dates from Year-Month-Date to Unix dates, so Opensea and CC dates can be matched.
        const listOfEpochTimes = flatData.map((item) => {
          return new Date(item.event_timestamp).getTime() / 1000;
        });

        //Matches the day a trade occured from OS to a day from CC. Takes average price of that day and saves to a new array
        historicCryptoPrices = MapEpochTimesToPrices(
          listOfEpochTimes,
          CCAPIData
        );

        //If the historic crypto prices have been received map the Opensea and historic crypto prices together.
        const mappedPricesToOSData = MapPricesToOSData(
          flatData,
          historicCryptoPrices
        );

        //If the data has been mapped together set up data for CSV download and show the download link.
        CSVDownloadLink(mappedPricesToOSData);

        //Reset state so more API calls can be made.
        setInfoSubmit(false);
        //Resets arrays so old data is not still contained within array
        historicCryptoPrices = [];
        openseaAPIData = [];
      }
    } else {
      console.log("An error happened and the data returned was not correct");
    }
  };

  const CSVDownloadLink = (mappedData) => {
    if (mappedData.length > 0) {
      //Display link to download CSV file
      setContent(
        <CSVLink
          data={mappedData}
          filename={filteringState.fileName}
          headers={CSVHeaders}
        >
          Export to CSV
        </CSVLink>
      );
    } else {
      setContent("No data in specified date range");
      historicCryptoPrices = [];
      openseaAPIData = [];
    }
  };

  //When filtering info is submitted by the user hitting the submit button enter useEffect and getData function to make API call.
  //Also triggered by the pageCursor state being updated.
  useEffect(() => {
    if (infoSubmit === true) {
      if (filteringState.wAddress) {
        setContent("Data is being loaded");
        getData();
      } else {
        setInfoSubmit(false);
        setContent("Please enter a wallet address");
      }
    }
  }, [infoSubmit, pageCursor]);

  //Display the download link when all data has been combined.
  return (
    <>
      <div className="content">{content}</div>
    </>
  );
};

export default APICalls;
