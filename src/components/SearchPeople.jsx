import React from "react";
import { CiSearch } from "react-icons/ci";
import Input from "./Input";
import Button from "./Button";
import { IoMdMail } from "react-icons/io";

const SearchPeople = () => {
  return (
    <div className="flex max-w-[40%] flex-col rounded-2xl bg-white p-3">
      <div className="flex gap-2">
        <CiSearch className="text-green-400" />
        <span>Find People</span>
      </div>
      <span>Search for people by their email address to start chatting</span>

      <div className="relative flex gap-2">
        <IoMdMail className="absolute" />

        <Input
          type="text"
          placeholder="Enter email address"
          label="Email Address"
        />

        <Button className="bg-green-400 text-white">Search</Button>
      </div>

      <div className="rounded-2xl bg-blue-300 p-2">
        <span>Tips</span>
        <ul>
          <li>You can search with partial email address</li>
          <li>Added contacts will appear in your contact list</li>
          <li>Click "Chat" to start a conversation immediately</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchPeople;
