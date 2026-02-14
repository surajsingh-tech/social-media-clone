import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPost, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { setUnfollow ,setFollow} from "@/redux/authSlice";


export default function Post({ post }) {

  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [postComment, setPostComment] = useState(post.comments || []);
  const dispatch = useDispatch();
  const [like, setLike] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes?.length);
  const [follow,setFollowbtn] =useState(false)

 
  const likeOrDislikeHandler = async (postId) => {
    try {
      const action = like ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${postId}/${action}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        const updatedLike = like ? postLike - 1 : postLike + 1;
        setPostLike(updatedLike);
        const updateLikes = posts?.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: like
                  ? p.likes?.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p,
        );

        dispatch(setPost(updateLikes));
        toast.success(res.data.message);
        setLike(!like);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const commentHandler = async (postId) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${postId}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        const updateCommentsData = [...postComment, res.data.comment];
        setPostComment(updateCommentsData);

        const updatedPostData = posts.map((p) =>
          p._id === postId ? { ...p, comments: updateCommentsData } : p,
        );

        dispatch(setPost(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const changeEventHandler = (e) => {
    const { value } = e.target;
    setText(value.trim() ? value : "");
  };

  const deletePost = async (postId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${postId}`,
        { withCredentials: true },
      );

      if (res.data.success) {
        const updatedData = posts?.filter((p) => p._id !== postId);
        dispatch(setPost(updatedData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const bookMarkHandler =async ()=>{
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`,{withCredentials:true})
        if(res.data.success)
        {
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response?.data?.message||'Somthing went wrong')
      }
  }

  const followUnfollowHandler=async()=>{
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/followorunfollow/${post?.author?._id}`,{withCredentials:true})
        if(res.data.success)
        {
          toast.success(res.data.message)
          if(res.data?.follow)
          {
            dispatch(setFollow(post?.author?._id))
            setFollowbtn(true)
          }
          else if(! res.data?.follow){
            dispatch(setUnfollow(post?.author?._id))
            setFollowbtn(false)
          }
        }

      } catch (error) {
        toast.error(error.response?.data?.message || 'Somthing went wrong')
      }
  }
  
  useEffect(()=>{
    if(user)
    {
     const isFollowing  =  user?.following?.includes(post?.author?._id)
     if(isFollowing)
     {
      setFollowbtn(true)
     }}
  },[])
  
  return (
    <div className="my-6 w-full max-w-md mx-auto bg-white rounded-2xl shadow-md border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={post?.author?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
               <h1 className="font-semibold text-sm"> {post?.author?.username ?? ""} </h1>
               {user?._id===post?.author._id&& ( <Badge variant="secondary">Author</Badge> ) }
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer hover:text-gray-500" />
          </DialogTrigger>
           
          <DialogContent className="flex flex-col items-center text-sm text-center">
             {
              post?.author?._id !== user?._id && (
              follow ? ( <Button onClick={followUnfollowHandler} variant="ghost" className="w-full text-red-500 font-bold"> Unfollow  </Button> )
               : ( <Button onClick={followUnfollowHandler} variant="ghost" className="w-full text-green-500 font-bold"> Follow  </Button> )
            )}
           
            <Button variant="ghost" className="w-full">
              Add to Favorites
            </Button>

            {user?._id === post?.author?._id && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => deletePost(post?._id)}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="w-full aspect-square overflow-hidden bg-gray-100">
        <img
          src={post?.image}
          alt="post"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          {like ? (
            <FaHeart
              onClick={() => likeOrDislikeHandler(post._id)}
              size={22}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={() => likeOrDislikeHandler(post._id)}
              size={22}
              className="cursor-pointer hover:text-gray-500"
            />
          )}

          <MessageCircle
            onClick={() => {
              (setOpen(true), dispatch(setSelectedPost(post)));
            }}
            className="cursor-pointer hover:text-gray-500"
          />

          <Send className="cursor-pointer hover:text-gray-500" />
        </div>

        <Bookmark onClick={bookMarkHandler} className="cursor-pointer hover:text-gray-500" />
      </div>

      {/* Likes */}
      <span className="px-4 text-sm font-semibold">{postLike ?? 0} likes</span>

      {/* Caption */}
      <p className="px-4 py-2 text-sm">
        <span className="font-semibold mr-1">
          {post?.author?.username ?? ""}
        </span>
        {post?.caption ?? ""}
      </p>

      {/* Comments */}
      {postComment.length>0&&(
      <span
        onClick={() => (setOpen(true), dispatch(setSelectedPost(post)))}
        value={text}
        className="px-4 text-sm text-gray-500 cursor-pointer hover:underline"
      >

        View all {postComment.length} comments
      </span>)}
      
      <CommentDialog open={open} setOpen={setOpen} post={post} />

      {/* Add Comment */}
      <div className="flex items-center px-4 py-3 border-t gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 outline-none text-sm px-3 py-2 rounded-full bg-gray-100 focus:bg-white border focus:ring-1 focus:ring-blue-400"
          value={text}
          onChange={changeEventHandler}
        />

        {text && (
          <span
            className="text-blue-500 font-semibold cursor-pointer"
            onClick={() => commentHandler(post._id)}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}
