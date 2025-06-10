import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import React, { useEffect, useState } from "react";
import Button from "./components/Button";

import UserList from "./components/UserList";
import { ListUser } from "./mock_data/ListUser";
import Sidebar from "./components/Sidebar";

function App() {
  //  const [users, setUsers] = useState([]);

  //   const fetchUsers = async () => {
  //       await getDocs(collection(db, "users"))
  //           .then((querySnapshot)=>{
  //               const newData = querySnapshot.docs
  //                   .map((doc) => ({...doc.data(), id:doc.id }));
  //                   setUsers(newData);
  //               console.log(users, newData);
  //           })

  //   }

  //   useEffect(()=>{
  //     fetchUsers()
  //   }, [])
  return (
    <div className="grid [grid-template-columns:2fr_8fr] gap-4">
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-white p-4 shadow">
          <h1 className="text-2xl font-bold">Web Chat</h1>
          <h1 className="text-2xl font-bold">Web Chat</h1>
          <h1 className="text-2xl font-bold">Web Chat</h1>
          <h1 className="text-2xl font-bold">Web Chat</h1>
          <h1 className="text-2xl font-bold">Web Chat hehe</h1><h1 className="text-2xl font-bold">Web Chat</h1><h1 className="text-2xl font-bold">Web Chat</h1><h1 className="text-2xl font-bold">Web Chat</h1>
        </header>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
