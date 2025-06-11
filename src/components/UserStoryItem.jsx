import React from "react";
import Avatar from "./Avatar";

const UserStoryItem = ({ src, name }) => {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="rounded-full bg-blue-600 p-0.5">
        <div className="p-0.1 rounded-full bg-gray-800">
          <Avatar src={src} className="" />
        </div>
      </div>
      <p className="mt-2 text-sm text-black">{name}</p>
    </div>
  );
};

export default UserStoryItem;
