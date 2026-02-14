
import React from "react";
import { useSelector } from "react-redux";
import {Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

export default function Messages() {
  useGetAllMessage()
  useGetRTM()
  const {user} = useSelector(store =>store.auth)
  const { selectedUser } = useSelector((store) => store.auth);
  const {messages} = useSelector(store => store.chat)
 
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>  <Button className="h-8 my-2" variant="secondary"> View Profile </Button> </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
       { messages?.map((msg,indx)=>( 
        <div className={`flex ${msg?.senderId === user?._id ? ' justify-end' : 'justify-start '}}`} key={msg?.id||indx}>
        <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          {msg.message}
        </div>
       </div> ))}
      </div>
    </div>
  );
}
