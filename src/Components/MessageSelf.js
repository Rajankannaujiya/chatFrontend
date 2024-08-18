
import React from "react";

function MessageSelf(props) {

    const userData=JSON.parse(localStorage.getItem("userData"));
    console.log(userData.user._id)
console.log("sender in self content",props?.content)

return (
    <div className="self-message-container">
        <div className="messageBox">
            <div className="self-text-content">
                <p className="con-Title">{userData.user.username}</p> {/* Render sender ID directly */}
                <p className="con-self-lastMessage">{props.content}</p>
                <p className="self-timeStamp">{props.timestamp}</p>
            </div>
        </div>
    </div>
);
}

export default MessageSelf;