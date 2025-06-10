import React from "react";

const HeadingMessageBar = ({ name }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-black">{name}</span>
      <div className="flex items-center gap-2"></div>
    </div>
  );
};

export default HeadingMessageBar;
