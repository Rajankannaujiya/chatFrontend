import React,{useContext} from 'react';
import logo from "../Components/Welcome.jpg";
import { myContext } from "./mainContainer";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";

function Welcome() {
const lightTheme=useSelector(state=>state.themekey);

const { refresh, setRefresh } = useContext(myContext);
console.log("Context API : refresh : ", refresh);
// console.log("Conversations of Sidebar : ", conversations);
const userData = JSON.parse(localStorage.getItem("userData"));
console.log("userData:",userData);
const navigate=useNavigate();
if(!userData){
  console.log("user is not Authenticatd");
  navigate("/");
  setRefresh(!refresh);
}


  return (
    <div className={'Welcome-container'  + (lightTheme ? "" : " dark")}> 
        Welcome to the Chat {userData.user.username} &#x1F44B;
        <div>
            <img src={logo} alt='logo' className='Welcome-logo'></img>
          </div>
            <p className={'Welcome-text' + (lightTheme ? "" : " dark")}>View and text to your friends and people</p>
       
    </div>
  )
}

export default Welcome;