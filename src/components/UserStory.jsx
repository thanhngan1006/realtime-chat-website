import React from "react";
import { IoMdAdd } from "react-icons/io";
import Button from "./Button";
import UserStoryItem from "./UserStoryItem";

const UserStory = ({ userStorys }) => {
  return (
    <div className="flex items-center gap-2 py-4">
      <Button className="rounded-full bg-blue-600 px-0 py-0 text-white hover:bg-blue-700">
        <IoMdAdd className="font-extrabold" />
      </Button>

      {userStorys.map((story, index) => (
        <UserStoryItem name={story.name} src={story.src} key={index} />
      ))}
    </div>
  );
};

export default UserStory;
