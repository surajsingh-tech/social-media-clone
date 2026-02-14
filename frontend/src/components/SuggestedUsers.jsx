import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { setFollow, setUnfollow } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";

export default function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const auth = useSelector((store) => store.auth.user);
  const dispatch = useDispatch()
  const [followState, setFollowState] = useState({});
    const followUnfollowHandler=async(suggestUserId)=>{
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/followorunfollow/${suggestUserId}`,{withCredentials:true})
        if(res.data.success)
        {
          setFollowState(pre=>({...pre,[suggestUserId]:res.data.follow}))
          toast.success(res.data.message)
          if(res.data?.follow)
          {
            dispatch(setFollow(suggestUserId))
          }
          else if(! res.data?.follow){
            dispatch(setUnfollow(suggestUserId))
          }
        }
      } catch (error) {
        
        toast.error(error.response?.data?.message || 'Somthing went wrong')
      }
  }

 useEffect(()=>{
    if(suggestedUsers && auth)
    {
      const state={}
      suggestedUsers.forEach(user=>state[user._id]=user.followers.includes(auth?._id))
      setFollowState(state)
    }
 },[suggestedUsers,auth?._id])

 
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 my-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-semibold text-gray-500 text-sm">
          Suggested for you
        </h1>
        <span className="font-medium text-xs cursor-pointer hover:underline">
          See all
        </span>
      </div>

      <div className="space-y-4">
        {suggestedUsers?.map((user) => { 
          const isFollow = followState[user._id];
          return (
            <div
              key={user._id}
              className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Link to={`/profile/${user?._id}`}>
                  <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>

                <div className="flex flex-col min-w-0">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="font-semibold text-sm truncate hover:underline"
                  >
                    {user?.username ?? ""}
                  </Link>

                  <span className="text-gray-500 text-xs truncate max-w-[180px] mt-1">
                    {user?.bio || "Bio here..."}
                  </span>
                </div>
              </div>

              {/* Button */}
              {isFollow ? (
                <Button
                  onClick={() => followUnfollowHandler(user?._id)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full
                  bg-red-100 text-red-600 hover:bg-red-200
                  active:scale-95 transition"
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  onClick={() => followUnfollowHandler(user?._id)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full
                  bg-green-600 text-white hover:bg-green-700
                  active:scale-95 transition shadow-sm"
                >
                  Follow
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
