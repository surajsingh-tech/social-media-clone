import React from "react";
import {
  Root as Avatar,
  Image as AvatarImage,
  Fallback as AvatarFallback,
} from "@radix-ui/react-avatar";

export default function Comment({ comment }) {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-start bg-gray-50 hover:bg-gray-100 transition p-2 rounded-lg">
        
        <Avatar className="w-8 h-8 rounded-full overflow-hidden shrink-0">
          <AvatarImage
            src={comment?.author?.profilePicture}
            alt="Pic"
            className="w-full h-full object-cover"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {comment?.author?.username}
          </span>

          <p className="text-sm text-gray-700 leading-snug break-words">
            {comment?.text}
          </p>
        </div>

      </div>
    </div>
  );
}
