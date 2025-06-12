import React from 'react';
import { LiaUserSecretSolid } from 'react-icons/lia';
import { BiHome } from 'react-icons/bi';
import { HiOutlinePencilAlt } from 'react-icons/hi';
import { AiFillLike } from 'react-icons/ai';
import { IoIosCamera, IoMdAddCircle } from 'react-icons/io';
import { FaMicrophone, FaRegImage, FaSmile } from 'react-icons/fa';
import { MdEmojiEmotions } from 'react-icons/md';
import Sidebar from '../components/Sidebar';
import HeadingMessageBar from '../components/HeadingMessageBar';
import MessageBox from '../components/MessageBox';
import Input from '../components/Input';
import { IoSearch } from 'react-icons/io5';

const Home = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-12">
      <div className="col-span-3 bg-gray-100 text-gray-900">
        <header className="flex items-center justify-between bg-white p-4 text-center shadow">
          <LiaUserSecretSolid className="h-8 w-8" onClick={() => {}} />
          <h3 className="text-2xl font-bold">Chat</h3>
          <div className="flex gap-2">
            <IoSearch className="h-8 w-8" onClick={() => {}} />
            <HiOutlinePencilAlt className="h-8 w-8" onClick={() => {}} />
          </div>
        </header>

        <Sidebar />
      </div>

      <div className="col-span-9 flex flex-col">
        <HeadingMessageBar name="Mon" activeTime="1h ago" />

        <div className="flex-1 overflow-y-auto bg-gray-200 p-4">
          <MessageBox
            messages={[
              'Hey! How are you?',
              'Shall we go for Hiking this weekend?',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat lacus laoreet non curabitur gravida.',
            ]}
            isYourMessage={false}
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />

          <div className="my-2 text-center text-sm text-gray-400">
            FRI 3:04 PM
          </div>

          <MessageBox
            messages={[
              "Hey! I'm good, thanks!",
              "Hiking sounds great! Let's do it.",
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            ]}
            isYourMessage={true}
          />

          <MessageBox
            messages={[
              'Hey! How are you?',
              'Shall we go for Hiking this weekend?',
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Volutpat lacus laoreet non curabitur gravida.',
            ]}
            isYourMessage={false}
            src="https://randomuser.me/api/portraits/women/44.jpg"
          />
        </div>

        <div className="fixed bottom-0 grid w-[75%] grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-gray-700 bg-white p-2 shadow-2xl">
          <div className="flex items-center gap-2 text-blue-400">
            <IoMdAddCircle className="h-8 w-8" />
            <FaRegImage className="h-8 w-8" />
            <IoIosCamera className="h-8 w-8" />
            <FaMicrophone className="h-8 w-8" />
          </div>

          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Aa"
              className="w-full rounded-full border bg-gray-100 px-10 py-2 text-gray-600 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <MdEmojiEmotions
              onClick={() => console.log('ok')}
              className="absolute bottom-2.5 left-3 h-5 w-5 text-gray-500"
            />
          </div>

          <div className="text-blue-400">
            <AiFillLike className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
