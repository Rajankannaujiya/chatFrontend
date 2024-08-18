import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';
import { myContext } from "./mainContainer";
import { useSelector, useDispatch } from "react-redux";
import { refreshSidebarFun } from "../Features/refreshSidebar.js"
import { BACKEND_URL } from './config.js';

function Users() {
  const dispatch = useDispatch();
  const lightTheme = useSelector(state => state.themekey);
  const { refresh, setRefresh } = useContext(myContext);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const { pathname } = location;
  const decodedUrl = decodeURIComponent(pathname);
  // Extract chat ID and user from the URL
  const parts = decodedUrl.split("/");
  const lastPart = parts[parts.length - 1];
  var [chatId, user] = lastPart.split("&");

  console.log("chatId is this", chatId)
  console.log("user is this", user)
  if (!userData) {
    console.log("user is not authenticate");
    navigate("/");
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the GET request with Axios, passing the request body
        const response = await Axios.get(`${BACKEND_URL}/chats/allUser`, {
          params: { userId: userData.user._id }
        });
        setUsers(response.data);

      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      }
    };

    fetchData();
  }, [refresh, userData.user._id]);


  return (
    <div className={'user' + (lightTheme ? "" : " dark")}>
      <div className={'user-header' + (lightTheme ? "" : " dark")}>
        <h1>Available users</h1>
      </div>

      <div className={"online-SearchBar" + (lightTheme ? "" : " dark")}>

        <IconButton style={{ backgroundColor: 'white' }} >
          <SearchIcon />
        </IconButton>
        <input type="search" placeholder="Searchs" className="search-box"></input>
      </div>

      <div className={"Sb-Conversation" + (lightTheme ? "" : " dark")}>
        {
          users.map((user, index) => {
            return (
              <div key={index} className={"Conversation-Container" + (lightTheme ? "" : " dark")}
                onClick={async () => {
                  const recieverId = user._id;
                  console.log("Creating chat with ", user.username);

                  try {

                    console.log("chat id is", chatId);
                    const response = await Axios.post(`${BACKEND_URL}/chats/createOrRetrieveChat/${recieverId}?userId=${userData.user._id}`);
                    console.log(response.data)
                    
                    dispatch(refreshSidebarFun());
                    setRefresh(!refresh)
                    navigate(
                    "chat/" +
                    response.data._id +
                    "&" +
                    (response.data.participants[1].username !== userData.user.username ?
                      response.data.participants[1].username :
                      response.data.participants[0].username)
                  )
                  }
                  catch (error) {
                    console.log("an error occur", error);
                  }
                }
                }
              >
                <div >
                  {/* Render either username or name */}
                  <p className="con-icon">
                    {user?.username[0]}
                  </p>
                </div>
                <div>
                  {/* Render either username or name */}
                  <p className="con-Tittle">{user.username}</p>
                  <p className="con-lastMessage">{user.messages || "click to start messages"}</p>
                </div>
                <div>
                  <p className="con-timeStamp">{user.timeStamp || "now"}</p>
                </div>
              </div>
            );
          })
        }
        {/* <ConversationItem /> */}
      </div>

    </div>
  )
}

export default Users