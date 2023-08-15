import React from "react";
import DatePicker from "react-datepicker";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";

function Calendar({
  endDate,
  setEndDate,
  startDate,
  setStartDate,
  handleDate,
}) {
  return (
    <>
      <DatePicker
        selected={startDate}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        onChange={(date) => {
          setStartDate(date);
          handleDate(date, "startDate");
        }}
      />
      <br></br>
      <DatePicker
        selected={endDate}
        selectsEnd
        startDate={startDate}
        minDate={startDate}
        endDate={endDate}
        onChange={(date) => {
          setEndDate(date);
          handleDate(date, "endDate");
        }}
      />
    </>
  );
}

export default Calendar;
