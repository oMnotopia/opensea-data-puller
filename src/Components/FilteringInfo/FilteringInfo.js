import React, { useState } from "react";
import Calendar from "../DatePicker/index";
import "./FilteringInfo.css";

const FiltertingInfo = ({
  setFilteringState,
  filteringState,
  setInfoSubmit,
}) => {
  //State that contains default values of filtered information
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  //Updates the filtering state from user input values
  const handleChange = (ev, value) => {
    console.log(ev, value);
    if (ev instanceof Date) {
      const newEpochDate = ev.getTime() / 1000;
      if (value === "endDate") {
        setFilteringState({
          ...filteringState,
          endDate: newEpochDate,
        });
      } else if (value === "startDate") {
        setFilteringState({
          ...filteringState,
          startDate: newEpochDate,
        });
      }
    } else {
      setFilteringState({
        ...filteringState,
        [ev.target.name]: ev.target.value,
      });
    }
  };

  //Pauses the page submit so that user entered information can be gathered without refreshing the page.
  //Also changes state of infoSubmit, which triggers the useEffect in Opensea.js causing API call to be made.
  const handleSubmit = (ev) => {
    ev.preventDefault();
    setInfoSubmit(true);
    console.log("in prevent default");
  };

  return (
    <div className="filter">
      <h1 className="title">Opensea API Data </h1>
      <form onSubmit={handleSubmit}>
        <label>
          Wallet Address:{" "}
          <input
            type="text"
            name="wAddress"
            value={filteringState.wAddress}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <label>
          Event Type:{" "}
          <select
            name="eventType"
            value={filteringState.eventType}
            onChange={handleChange}
          >
            <option></option>
            <option value="successful">Successful</option>
            <option value="transfer">Transfer</option>
          </select>
        </label>
        <br></br>
        <label>
          Transactions Occuring Before & After: <br></br>
          <Calendar
            endDate={endDate}
            setEndDate={setEndDate}
            startDate={startDate}
            setStartDate={setStartDate}
            handleDate={handleChange}
          />
        </label>
        <br></br>
        <label>
          CSV Filename:{" "}
          <input
            type="text"
            name="fileName"
            value={filteringState.fileName}
            onChange={handleChange}
          />
        </label>
        <br></br>
        <br></br>
        <label>
          <button className="submit" type="submit">
            Submit
          </button>
        </label>
      </form>
    </div>
  );
};

export default FiltertingInfo;
