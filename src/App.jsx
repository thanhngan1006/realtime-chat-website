import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import React, { useEffect, useState } from "react";
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
    <div className="grid min-h-screen w-full grid-cols-12">
      <div className="col-span-2 bg-gray-100 text-gray-900">
        <header className="bg-white p-4 shadow">
          <h1 className="text-2xl font-bold">Web Chat</h1>
        </header>
        <Sidebar />
      </div>

      <div className="col-span-10 bg-red-300">
        <div></div>
      </div>
    </div>
  );
}

export default App;
