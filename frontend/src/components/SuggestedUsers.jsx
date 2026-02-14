import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

export default function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="my-6 sm:my-8 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h1 className="font-semibold text-gray-500 text-xs sm:text-sm">
          Suggested for you
        </h1>
        <span className="font-medium text-xs cursor-pointer hover:underline">
          See all
        </span>
      </div>

      {/* Users */}
      <div className="space-y-3 sm:space-y-4">
        {suggestedUsers?.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-2 ring-gray-100">
                  <AvatarImage src={user?.author?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex flex-col min-w-0">
                <Link
                  to={`/profile/${user?._id}`}
                  className="font-semibold text-xs sm:text-sm truncate hover:underline"
                >
                  {user?.username ?? ""}
                </Link>

                <span className="text-gray-500 text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-[150px] mt-1">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>

            <button className="text-blue-500 text-[11px] sm:text-xs font-semibold hover:text-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}