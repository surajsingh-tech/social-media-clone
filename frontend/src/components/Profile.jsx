import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetProfile from "@/hooks/useGetProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetProfile(userId);

  const { userProfile,user } = useSelector((store) => store.auth);

  const isLogedInUserProfile =user?._id ===  userProfile?._id;
  const isFollowing = true;

  const [activeTab, setActiveTab] = useState("posts");

  const displayPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-10 py-6">
        {/* Profile Header */}
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center md:items-start">
          {/* Avatar */}
          <section className="flex justify-center">
            <Avatar className="h-28 w-28 sm:h-32 sm:w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilePhoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* Info */}
          <section className="w-full text-center md:text-left">
            <div className="flex flex-col gap-5">
              {/* Username + Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap justify-center md:justify-start">
                <span className="text-lg font-semibold">
                  {userProfile?.username}
                </span>

                {isLogedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="h-8">
                        Edit Profile
                      </Button>
                    </Link>
 
                    <Button variant="secondary" className="h-8">
                      View archive
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Add Tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button className="bg-[#0095F6] hover:bg-[#196ca3] text-white h-8">
                      Unfollow
                    </Button>
                    <Button className="bg-[#0095F6] hover:bg-[#196ca3] text-white h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#196ca3] text-white h-8">
                    Follow
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 text-sm">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts?.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers?.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following?.length}
                  </span>{" "}
                  following
                </p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1 items-center md:items-start">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign className="w-4 h-4" />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm">
            <span
              onClick={() => setActiveTab("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold border-t-2 border-black" : ""
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => setActiveTab("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold border-t-2 border-black" : ""
              }`}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-1">
            {displayPost?.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post?.image}
                  alt="post"
                  className="w-full aspect-square object-cover"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="flex items-center text-white gap-6 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>{post?.likes?.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>{post?.comments?.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
