import APICalls from "./Components/APICalls/APICalls";
import FiltertingInfo from "./Components/FilteringInfo/FilteringInfo";
import React, { useState } from "react";
import "./App.css";

function App() {
  //State that contains default values of filtered information
  const [filteringState, setFilteringState] = useState({
    wAddress: "",
    eventType: "successful",
    startDate: new Date().getTime() / 1000,
    endDate: new Date().getTime() / 1000,
    fileName: "",
  });
  const [infoSubmit, setInfoSubmit] = useState(false);

  return (
    <div className="App">
      <div className="APIContainer">
        {/* Component for user entered information */}
        <FiltertingInfo
          setFilteringState={setFilteringState}
          filteringState={filteringState}
          setInfoSubmit={setInfoSubmit}
        />
        {/* Component for API calls  */}

        <APICalls
          filteringState={filteringState}
          infoSubmit={infoSubmit}
          setInfoSubmit={setInfoSubmit}
        />
      </div>
    </div>
  );
}

export default App;
