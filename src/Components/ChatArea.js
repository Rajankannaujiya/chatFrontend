import React, { useContext, useEffect, useState, useRef } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from "@mui/material";
import Axios from "axios";
import { myContext } from "./mainContainer";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
const ENDPOINT = "https://chat-backend-plum-alpha.vercel.app";
var socket;


function ChatArea() {
    const lightTheme = useSelector((state) => state.themekey)

    const messagesEndRef = useRef(null);
    const [chat, setChat] = useState([]);
    const [users, setUsers] = useState([]);

    const userData = JSON.parse(localStorage.getItem("userData"));
    const [allMessages, setAllMessages] = useState([]);
    const { refresh, setRefresh } = useContext(myContext);
    const [messageContent, setMessageContent] = useState([]);
    // const [socketConnectionStatus, setSockerConnectionStatus] = useState(false);
    const [allMessagesCopy, setAllMessagesCopy] = useState([]);
    const location = useLocation();
    const { pathname } = location;
    const decodedUrl = decodeURIComponent(pathname);
    // Extract chat ID and user from the URL
    const parts = decodedUrl.split("/");
    const lastPart = parts[parts.length - 1];
    var [chatId, user] = lastPart.split("&");
    // console.log("these are the chatid and user", chatId, user)



    useEffect(() => {
        const fetchData = async () => {
            try {
                // Make the GET request with Axios, passing the request body
                const response = await Axios.get("/chats/allUser", {
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

    useEffect(() => {
        const fetchChats = async () => {
            // setLoading(true);
            try {
                const response = await Axios.get("/chats/fetchChats", {
                    params: { userId: userData.user._id }
                });
                setChat(response.data.chats);

            } catch (err) {
                console.log("Error fetching chats:", err);
            }
        };
        fetchChats();
    }, [userData.user._id, refresh]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get(`/chats/messages/${chatId}?userId=${userData.user._id}`);
                setAllMessages(response.data.messages);
                socket.emit("join chat", chatId)
                setAllMessagesCopy(allMessages)
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        if (chatId) {
            fetchData();
        }
    }, [refresh, chatId, userData.user._id, allMessages]);


    useEffect(() => {
        const setConnection =async()=>{
        try {
            socket =  io(ENDPOINT, {  
                cors: {
                origin: "*",
                credentials: true
              },transports : ['websocket'] });
            // socket.emit("setup", userData);
            socket.on("connection", () => {
                socket.emit("setup", userData);
            })
            socket.on("connect_error", (err) => {
                console.log(err.message);
    
                // some additional description, for exle the status code of the initial HTTP response

                console.log(err.description);
    
                console.log(err.context);
            });
        } catch (error) {
            console.log(error)
        }
    }
    setConnection();
    }, [userData,refresh])


    useEffect(() => {
        socket.on("message recieved", (newMessage) => {
            if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {

            }
            else {
                setAllMessages([...allMessages], newMessage)
            }
        })
    })

    const handleMessageContentSubmit = async (event) => {

        try {
            // Find the chat with matching chatId
            const chatToUpdate = chat.find(chatItem => chatItem._id === chatId);

            if (!chatToUpdate) {
                console.error("Chat not found for chatId:", chatId);
                return;
            }

            const isgroup = chatToUpdate.isgroup;

            let receiver;
            if (isgroup) {
                // Handle group chat
                receiver = chatToUpdate.participants.map(participant => participant._id);
            } else {
                // Handle direct message
                const receiverDetail = users.find(receiver => receiver.username === user);
                receiver = receiverDetail ? receiverDetail._id : null;
            }

            const { data } = await Axios.post(`/chats/messages?userId=${userData.user._id}`, {
                reciever: receiver,
                content: messageContent,
                chatId: chatId,
                isgroup: isgroup
            });

            if (data) {
                setAllMessages([...allMessages, data]);
                socket.emit("new messages", data.message.content)
                setMessageContent("");
            }
            // Handle response from backend as needed
        } catch (error) {
            console.error("An error occurred while sending the message:", error);
            // Handle error, e.g., show an error message to the user
        }
    };

    const handleDelete = async (event) => {

        try {
            const response = await Axios.delete(`/chats/deleteMessages/${chatId}?userId=${userData.user._id}`);

            setAllMessages(response.data.chat.messages);

        }
        catch (error) {
            console.log("this is the error", error);
        }
    }



    return (<div className={"chatArea-container" + (lightTheme ? "" : " dark")}>
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
            <p className="con-icon">
                {user[0]}
            </p>
            <div className={"header-text" + (lightTheme ? "" : " dark")}>
                <p className="con-Tittle">{user}</p>
                <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>{ }</p>
            </div>
            <IconButton onClick={() => {
                handleDelete();
                setRefresh(!refresh);
            }}>
                <DeleteIcon className={(lightTheme ? "" : " dark")} />
            </IconButton>
        </div>
        <div className={"message-container" + (lightTheme ? "" : " dark")}>
            {allMessages
                .slice(0)

                .map((message, index) => {
                    const sender = message.sender;
                    // console.log("sender", sender)
                    const self_id = userData.user._id;
                    if (sender === self_id) {
                        // console.log("I sent it ", sender);
                        return <div className={"self-message-container" + (lightTheme ? "" : " dark")} key={index}>
                            <div className="messageBox">
                                <div className="self-text-content">
                                    <p className={"con-Title" +  (lightTheme ? "" : " darktext")}>{userData.user.username}</p>
                                    <p className={"con-self-lastMessage" + (lightTheme ? "" : " darktext")}>{message?.content}</p>
                                    {message.timestamp ? (
                                        <p className={"self-timeStamp" + (lightTheme ? "" : " darktext")}>{new Date(message.timestamp).toLocaleDateString()}</p>
                                    ) : (
                                        <p className={"self-timeStamp" + (lightTheme ? "" : " darktext")}> now</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    }

                    else {
                        // console.log("Someone Sent it");
                        return (<div className="other-message-container" key={index}>
                            <div className={"conversation-container" + (lightTheme ? "" : " dark")}>
                                <p className={"con-icon" + (lightTheme ? "" : " dark")}>     {message ? user[0] : ""}</p>
                                <div className="other-text-content">
                                    <p className={"con-Title" +(lightTheme ? "" : " darktext")}>{message ? user : ""}</p>
                                    <p className={"con-lastMessage" +(lightTheme ? "" : " darktext")}>{message ? message.content : ""}</p>
                                    {message.timestamp ? (
                                        <p className={"self-timeStamp" +(lightTheme ? "" : " darktext")}>{new Date(message.timestamp).toLocaleDateString()}</p>
                                    ) : (
                                        <p className={"self-timeStamp" + (lightTheme ? "" : " darktext")}> now</p>
                                    )}
                                </div>
                            </div>
                        </div>)
                    }
                })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
            <input placeholder="Type message" className="search-box" value={messageContent}
                onChange={(event) => setMessageContent(event.target.value)}
                onKeyDown={(event) => {
                    if (event.code === "Enter") {
                        handleMessageContentSubmit();
                        setMessageContent("");
                        setRefresh(!refresh);
                    }
                }}
            ></input>
            <IconButton onClick={() => {
                handleMessageContentSubmit()
                setRefresh(!refresh)
            }}>
                <SendIcon className={(lightTheme ? "" : " dark")} />
            </IconButton>

        </div>

    </div>);

}
export default ChatArea;
