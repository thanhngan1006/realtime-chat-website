import React from "react";
import { IoMdAdd } from "react-icons/io";
import Button from "./Button";
import UserStoryItem from "./UserStoryItem";

const UserStory = ({ userStorys }) => {
  return (
    <div className="w-11/12">
      <div className="flex gap-2 overflow-x-auto py-4">
        <div className="flex flex-col items-center text-white">
          <div className="rounded-full bg-blue-600 p-0.5">
            <div className="rounded-full bg-gray-500">
              <div className="flex h-10 w-10 items-center justify-center">
                <IoMdAdd className="font-extrabold text-white" />
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-black">Add</p>
        </div>

        <div className="flex gap-2">
          {userStorys.map((story, index) => (
            <UserStoryItem name={story.name} src={story.src} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserStory;
