import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { setPost } from "@/redux/postSlice";


export default function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");
  const {selectedPost}=useSelector(store=>store.post)
  const [postComments,setPostcomments]=useState([])
  const allPost=useSelector(store=>store.post.posts||[])
  const dispatch=useDispatch()
 
  useEffect(()=>{
    if(selectedPost)
    {
    setPostcomments(selectedPost.comments)
    }
  },[selectedPost])

  const isDisabled = text.trim().length === 0;

  const changeEventhandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };
  
  
  const commentHandler = async (e) => {
    e.preventDefault()
    try {
     
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        const updateComment=[res.data?.comment,...postComments]
        setPostcomments(updateComment)
       
        const allComments = allPost?.map(p=>(
          p._id===selectedPost._id ? {...p, comments : updateComment} :p
        ))

        dispatch(setPost(allComments))
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || "Something went wrong");
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
              src={selectedPost?.image}
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
                    <AvatarImage src={selectedPost?.author?.profilePicture} alt="avatar" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
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
              {postComments?.map(comment=>(
                 <Comment key={comment._id} comment={comment}/>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t sticky bottom-0 bg-white">
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={text}
                  onChange={(e)=>changeEventhandler(e)}
                  type="text"
                  className="w-full outline-none border border-gray-300 p-2 rounded text-sm"
                  placeholder="Add a Comment..."
                />
                <button
                  disabled={isDisabled}
                  onClick={(e)=>commentHandler(e)}
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
