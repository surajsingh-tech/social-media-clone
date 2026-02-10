import {
  Heart,
  HomeIcon,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";


export default function Sidebar() { 
  const dispatch=useDispatch()
  const {user}=useSelector(store=>store.auth)
  const navigate = useNavigate();
  const [open,setOpen]=useState(false)
  const logOut = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null))
        navigate("/login");
        toast.success(res.data.success.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
 
  const sidebar = [
  { icon: <HomeIcon />, text: "Home" },
  { icon: <Search />, text: "Search" },
  { icon: <TrendingUp />, text: "Explore" },
  { icon: <MessageCircle />, text: "Messages" },
  { icon: <Heart />, text: "Notifications" },
  { icon: <PlusSquare />, text: "Create" },
  {
    icon: (
      <Avatar className="w-7 h-7">
        <AvatarImage
          src={user?.profilePicture}
          alt="@shadcn"
          className="grayscale"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    text: "Profile",
  },
  { icon: <LogOut />, text: "Logout" },
];


  const getSidebarText = (text) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Search":
        navigate("/");
        break;
      case "Explore":
        navigate("/");
        break;
      case "Messages":
        navigate("/");
        break;
      case "Notifications":
        navigate("/");
        break;
      case "Create":
       setOpen(true)
        break;
      case "Profile":
        navigate("/");
        break;
      case "Logout":
        logOut();
        break;
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="
          hidden md:flex fixed top-0 left-0 z-10
          h-screen border-r border-gray-300 bg-white
          flex-col px-2 w-16 sm:w-20 md:w-1/5 lg:w-[16%]
        "
      >
        <div className="flex items-center justify-center py-4">
          <h1 className="my-8 pl-3 font-bold text-xl">
            Logo
          </h1>
        </div>
        <div className="flex flex-col flex-1">
          {sidebar.map((item, indx) => (
            <div
              key={indx}
              onClick={() => getSidebarText(item.text)}
              className="
                flex items-center gap-3 
                hover:bg-gray-100 cursor-pointer 
                rounded-lg p-3 my-1 transition-colors
              "
            >
              {item.icon}
              <span className="hidden md:inline">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen}/>

      {/* Mobile Bottom Navbar */}
      <div
        className="
          md:hidden fixed bottom-0 left-0 right-0 
          border-t border-gray-300 bg-white 
          flex justify-around py-2 z-20
        "
      >
        {sidebar.map((item, indx) => (
          <div
            key={indx}
            onClick={() => getSidebarText(item.text)}
            className="flex flex-col items-center text-xs cursor-pointer"
          >
            {item.icon}
            <span className="text-[10px]">{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
