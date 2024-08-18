import React from "react";

function MessageOthers(props){
    console.log( "props in other",  props)
    return(<div className="other-message-container">
        <div className="conversation-container">
            <p className="con-icon">     {props?.sender}</p>
            <div className="other-text-content">
                <p className="con-Title">{props?.sender}</p>
                <p className="con-lastMessage">{props?.content}</p>
                <p className="self-timeStamp">{props?.timestamp}</p>
            </div>
        </div>
    </div>)
}

export default MessageOthers;