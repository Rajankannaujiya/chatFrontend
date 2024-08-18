import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Axios from 'axios';
import { refreshSidebarFun } from "../Features/refreshSidebar.js"
import { myContext } from "./mainContainer";
import { useSelector, useDispatch } from "react-redux";
import { BACKEND_URL } from './config.js';

function Group() {

  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themekey);
  const { refresh, setRefresh } = useContext(myContext);

  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();
  const [group, setGroup] = useState([]);


  if (!userData) {
    console.log("user is not authenticate");
    navigate("/");
  }

  useEffect(() => {
    Axios.get("/allTheGroups", {
      params: { userId: userData.user._id }
    }).then((response) => {
      // console.log("this is the response",response.data)
      setGroup(response.data)
    })
      .catch((err) => {
        console.log(err)
      })
  }, [group,userData.user._id])



  const [lastMessages, setLastMessages] = useState({});

  const fetchLastMessage = async (groupId) => {
    try {
      const response = await Axios.get(`${BACKEND_URL}/chats/groupMessages/${groupId}?userId=${userData.user._id}`);
      const messages = response.data

      if (Array.isArray(messages) && messages.length > 0) {
        
        // If messages is an array of messages objects
        const messageContents = messages.map(message => ({
          timestamp: message.timestamp,
          content: message.content
        }));
        // console.log("message contents:", messageContents);
        return messageContents;
      } else if (messages && typeof messages === 'object') {
        // If messages is a single message object
        const messageContent = {
          timestamp: messages.timestamp,
          content: messages.content
        };
        // console.log("message content:", messageContent);
        return [messageContent]; // Return as an array to keep consistent data structure
      } else {
        // console.log("No messages found or unexpected data structure.");
        return "No messages found";
      }
    } catch (error) {
      console.error("Error fetching last message for group:", error);
      return "Error fetching message";
    }
  };

  useEffect(() => {
    const fetchLastMessages = async () => {
      const messagesPromises = group.map((grp) => {
        return fetchLastMessage(grp._id);
      });
  
      const messages = await Promise.all(messagesPromises);
  
      const messagesMap = {};
      group.forEach((grp, index) => {
        messagesMap[grp._id] = messages[index];
      });
  
      setLastMessages(messagesMap);
      setRefresh(!refresh)
    };
  
    fetchLastMessages();
  }, [group]); // eslint-disable-line react-hooks/exhaustive-deps
  


  if (!userData) {
    navigate("/");
  }

  return (
    <div className={'group' + (lightTheme ? "" : " dark")}>
      <div>
        <h1 className={'group-header' + (lightTheme ? "" : " dark")}>Groups</h1>
      </div>
      <div className={"Sb-Conversation" + (lightTheme ? "" : " dark")}>

        {
          group.map((group, index) => (
          <div key={index} className={"Conversation-Container" + (lightTheme ? "" : " dark")}
            onClick={async () => {
              const groupId = group._id;

              try {
                const response = await Axios.post(`${BACKEND_URL}/chats/createGroupChat/${groupId}?userId=${userData.user._id}`);

                dispatch(refreshSidebarFun());
                
                navigate(
                  "chat/" +
                  response.data.fullChat._id +
                  "&" +
                  (response.data.fullChat.group.name)
                );
              } catch (error) {
                console.log("an error occur", error);
              }
            }}>
            <div>
              <p className="con-icon">
                {group?.name[0]}
              </p>
            </div>
            <div>
              <p className="con-Tittle">{group?.name}</p>
              {/* Render the last message once it's fetched */}

              {lastMessages[group._id] ? (
                lastMessages[group._id].length !== 0 ? (
                  <p className="con-lastMessage">
                    {lastMessages[group._id][lastMessages[group._id].length - 1].content}
                  </p>
                ) : (
                  <p className="con-lastMessage">Click here to start message</p>
                )
              ) : null}
            </div>
            <div>
            {lastMessages[group._id] ? (
                lastMessages[group._id].length !== 0 ? (
                  <p className="con-timeStamp">{lastMessages[group._id] ? new Date(lastMessages[group._id][lastMessages[group._id].length - 1].timestamp).toLocaleDateString() : ""}</p>
                ) : (
                  <p className="con-timeStamp"></p>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Group;