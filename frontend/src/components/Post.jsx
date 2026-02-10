import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import useGetAllPost from "@/hooks/useGetAllPost";
import { setPost } from "@/redux/postSlice";

export default function Post({ post }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    const { value } = e.target;
    if (value.trim()) {
      setText(value);
    } else {
      setText("");
    }
  };

  const deletePost = async (PostId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${PostId}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        const updatetedData = posts?.filter((p) => p._id !== PostId);
        dispatch(setPost(updatetedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture} alt="Post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>{post?.author?.username ?? ""}</h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer">
              Add to Favorites
            </Button>
            {user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => deletePost(post?._id)}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="Post_image"
      />

      {/* Actions */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      {/* Likes */}
      <span className="font-medium block mb-2">{post?.likes ?? ""}</span>

      {/* Username + Caption in one line */}
      <p className="flex items-center gap-2">
        <span className="font-medium">{post?.author?.username ?? ""}</span>
        <span>{post?.caption ?? ""}</span>
      </p>

      {/* Comments trigger */}
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-sm text-gray-400"
      >
        View all comments...
      </span>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment Input */}
      <div className="flex items-center justify-between mt-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          value={text}
          onChange={(e) => changeEventHandler(e)}
        />
        {text && <span className="text-[#38ADF8] cursor-pointer">Post</span>}
      </div>
    </div>
  );
}
