import React, { createContext, useState} from "react";
import Sidebar from "./sidebar.js";
import "./style.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// Import the context if needed
export const myContext = createContext();

function MainContainer() {

  // Access the themekey state from Redux store
  const lightTheme = useSelector(state => state.themekey);

  // Example of using local state
  const [refresh, setRefresh] = useState(true);




  return (
    <div className={"mainContainer" + (lightTheme ? "" : " dark")}>

      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>

        <Sidebar />

        <Outlet />
      </myContext.Provider>
    </div>
  );
}

export default MainContainer;
