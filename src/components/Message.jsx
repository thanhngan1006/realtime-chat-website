import React from "react";

const Message = ({ children, bgColor = "blue-500", textColor = "white" }) => {
  return (
    <div className={`rounded-xl px-3 py-2 text-${textColor} bg-${bgColor}`}>
      {children}
    </div>
  );
};

export default Message;
