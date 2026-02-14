import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUsers from "./SuggestedUsers";

export default function RightSideBar() {
  const { user } = useSelector(store => store.auth);
  return (
    <div className="w-full sm:w-[280px] md:w-[320px] my-6 sm:my-10 px-3 sm:px-0">
      
      {/* Profile Card */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white p-2 sm:p-3 rounded-xl shadow-sm hover:shadow-md transition">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-gray-200">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col leading-tight min-w-0">
          <h1 className="font-semibold text-xs sm:text-sm hover:underline truncate">
            <Link to={`/profile/${user?._id}`}>
              {user?.username ?? ""}
            </Link>
          </h1>

          <span className="text-gray-500 text-[11px] sm:text-xs truncate max-w-[140px] sm:max-w-[200px]">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>

      {/* Suggested Section */}
      <div className="mt-4 sm:mt-6">
        <SuggestedUsers />
      </div>
    </div>
  );
}