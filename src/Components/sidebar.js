import React, { useContext, useEffect, useState } from "react";

import Axios from "axios"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from "@mui/icons-material/LightMode"
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { useSelector, useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { myContext } from "./mainContainer";
import { toggleTheme } from "../Features/themeSlice";
import {BACKEND_URL} from './config.js'




function Sidebar() {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themekey)
  const { refresh, setRefresh } = useContext(myContext);
  console.log("Context API : refresh : ", refresh);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [Conversations, setConversation] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));


  useEffect(() => {
    const fetchChats = async () => {
      // setLoading(true);
      try {
        const response = await Axios.get(`${BACKEND_URL}/chats/fetchChats`, {
          params: { userId: userData.user._id }
        });
        setConversation(response.data.chats);
        // setLoading(false);
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [refresh,userData.user._id]);




  const navigate = useNavigate();

  return (<div className={"sideBar-container" + (lightTheme ? "" : " dark")}>

    <div className={"Sb-SubHeader" + (lightTheme ? "" : " dark")}>
      <div className="other-icons">

        <IconButton onClick={() => { navigate('users') }} >
          <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
        </IconButton>
        <IconButton onClick={() => { navigate('groups') }}>
          <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
        </IconButton>
        <IconButton onClick={() => { navigate('createGroups') }}>
          <ControlPointIcon className={"icon" + (lightTheme ? "" : " dark")} />
        </IconButton>
        <IconButton onClick={() => dispatch(toggleTheme())}>
          {/* <DarkModeIcon className={"icon" + (lightTheme ? "" : " dark")}/> */}
          {lightTheme && (
            <DarkModeIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          )}
          {!lightTheme && (
            <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
          )}
        </IconButton>


        <IconButton onClick={() => {
          localStorage.removeItem("userData")
          navigate('/')
        }}>
          <LogoutIcon className={"icon" + (lightTheme ? "" : " dark")} />
        </IconButton>
        
      </div>
    </div>
    <div className={"Sb-SearchBar" + (lightTheme ? "" : " dark")}>

      <IconButton style={{ backgroundColor: "white" }} className={"icon" + (lightTheme ? "" : " dark")}>
        <SearchIcon />
      </IconButton>
      <input type="search" placeholder="Searchs" className="search-box"></input>
    </div>
    { windowWidth >=633 &&
    <div className={"Sb-Conversation" + (lightTheme ? "" : " dark")}>
    {Conversations.map((conversation, index) => {
          if (conversation.isgroup === false) {
            console.log("conversation are this one",conversation)
            if (conversation.messages.length === 0) {
              console.log("No Latest Message with ", conversation.participants[1].username);
              return (
                <div
                  key={index}
                  onClick={() => {
                    console.log("Refresh fired from sidebar");
                    setRefresh(!refresh);
                  }}
                >
                  <div
                    key={index}
                    className="Conversation-Container"
                    onClick={() => {
                      navigate(
                        "chat/" +
                        conversation._id +
                        "&" +
                        (conversation.participants[1].username !== userData.user.username ?
                          conversation.participants[1].username:
                          conversation.participants[0].username)
                      );
                    }}
                  >
                    <div>
                      <p className={"con-icon" + (lightTheme ? "" : " dark")}>

                        {conversation.participants[1].username !== userData.user.username ?
                          conversation.participants[1].username[0] :
                          conversation.participants[0].username[0]}
                      </p>
                    </div>
                    <div>
                      <p className={"con-Tittle" + (lightTheme ? "" : " dark")}>
                      {conversation.participants[1].username !== userData.user.username ?
                          conversation.participants[1].username:
                          conversation.participants[0].username}
                      </p>
                      <p className="con-lastMessage">
                        No previous Messages, click here to start a new chat
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
            else {

              return (
                <div
                  key={index}
                  className="Conversation-Container"
                  onClick={() => {
                    navigate(
                      "chat/" +
                      conversation._id +
                        "&" +
                        (conversation.participants[0].username !== userData.user.username ?
                          conversation.participants[0].username:
                          conversation.participants[1].username)
                      );
                  }}
                >
                  <div>
                    <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                      {conversation?.participants[1].username[0]}
                    </p>
                  </div>
                  <div>
                    <p className={"con-Tittle" + (lightTheme ? "" : " dark")}>
                      {conversation?.participants[1].username}
                    </p>
                    {/* Render last message if available */}
                    {conversation.messages && conversation.messages.length >= 1 && (
                      <p className="con-lastMessage">
                        {conversation.messages[conversation.messages.length-1].content}
                      </p>
                    )}
                  </div>
                  <div>
                    {conversation.messages && conversation.messages.length >= 1 && (
                      <p className="con-timeStamp">{new Date(conversation.messages[conversation.messages.length-1].timestamp).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

              );
            }
          }
          else if (conversation.isgroup===true && conversation.group?.name) {
            console.log("group conversation is this one", conversation);
            if (conversation.messages.length === 0) {
              console.log("No Latest Message with ", conversation.group?.name);
              return (
                <div
                  key={index}
                  onClick={() => {
                    console.log("Refresh fired from sidebar");
                    setRefresh(!refresh);
                  }}
                >
                  <div
                    key={index}
                    className="Conversation-Container"
                    onClick={() => {
                      navigate(
                        "chat/" +
                        conversation._id +
                        "&" + (conversation.group.name)

                      );
                    }}
                  >
                    <div>
                      <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                        {conversation.group?.name[0]}
                      </p>
                    </div>
                    <div>
                      <p className={"con-Tittle" + (lightTheme ? "" : " dark")}>
                        {conversation.group?.name}
                      </p>
                      <p className="con-lastMessage">No previous message, click here to start one</p>
                    </div>
                  </div>
                </div>
              );
            }

            else {
              return (
                <div
                  key={index}
                  className="Conversation-Container"
                  onClick={() => {
                    navigate(
                      "chat/" +
                      conversation._id +
                        "&" + (conversation.group.name)
                    );
                  }}
                >
                  <div>
                    <p className={"con-icon" + (lightTheme ? "" : " dark")}>
                      {conversation ? conversation.group?.name[0] : ""}
                    </p>
                  </div>
                  <div>
                    <p className={"con-Tittle" + (lightTheme ? "" : " dark")}>
                      {conversation ? conversation.group?.name : ""}
                    </p>
                    {/* Render last message if available */}
                    {conversation.messages && conversation.messages.length >= 1 && (
                      <p className="con-lastMessage">
                        {conversation.messages[conversation.messages.length-1].content}
                      </p>
                    )}

                  </div>
                  <div>
                    {conversation.messages && conversation.messages.length >= 1 && (
                      <p className="con-timeStamp">{new Date(conversation.messages[conversation.messages.length-1].timestamp).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              );
            }
          }
          else{
            return null;
          }
      })}
    </div>
    }
  </div>)
}
export default Sidebar;