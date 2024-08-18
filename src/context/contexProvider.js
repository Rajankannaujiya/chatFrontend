import React, { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios"
import { useNavigate } from "react-router-dom";
import { myContext } from "../Components/mainContainer.js";


const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { refresh, setRefresh } = useContext(myContext);
const [user,setUser]=useState([])
  const [Conversations, setConversation] = useState([]);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchChats = async () => {
      // setLoading(true);
      try {
        const response = await Axios.get("http://localhost:5000/fetchChats", {
          params: { userId: userData.user._id }
        });
        setConversation(response.data.chats);
        // setLoading(false);
        console.log("conversations are", response.data.chats);
      } catch (err) {
        console.log("Error fetching chats:", err);
      }
    };
    fetchChats();
  }, [refresh]);


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
      Conversations,setConversation
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;