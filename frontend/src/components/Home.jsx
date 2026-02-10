import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "./RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPost";


export default function Home() {
   useGetAllPost()
  return ( 
    <>
      <div className="flex">
        <div className="flex-grow">
          <Feed />
          <Outlet />
        </div>
        <RightSideBar />
      </div>
      <Sidebar />
    </>
  );
}
 