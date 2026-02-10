import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");

  const isDisabled = text.trim().length === 0;

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/send/`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }

      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="w-full md:w-[60vw] max-w-none! h-[90vh] md:h-[70vh] p-0 flex flex-col overflow-hidden"
      >
        <DialogTitle className="sr-only">Comments</DialogTitle>

        <div className="flex flex-1 w-full flex-col md:flex-row">
          {/* Image section */}
          <div className="flex w-full md:w-1/2 bg-black items-center justify-center h-60 md:h-auto">
            <img
              className="w-full h-full object-contain"
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=764&auto=format&fit=crop"
              alt="Post_image"
            />
          </div>

          {/* Comments section */}
          <div className="w-full md:w-1/2 flex flex-col justify-between bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src="" alt="avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-xs">username</Link>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Add to Favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto p-4 text-sm">
              all comments all comments all comments all comments
            </div>

            {/* Input */}
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={text}
                  onChange={changeEventhandler}
                  type="text"
                  className="w-full outline-none border border-gray-300 p-2 rounded text-sm"
                  placeholder="Add a Comment..."
                />
                <button
                  disabled={isDisabled}
                  onClick={sendMessage}
                  className="text-blue-500 font-semibold disabled:text-gray-400"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
