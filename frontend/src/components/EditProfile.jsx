import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

export default function EditProfile() {
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput((pre) => ({ ...pre, profilePicture: file }));
  };

  const selectChangeHandler = (value) => {
    setInput((pre) => ({ ...pre, gender: value }));
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    if (input.bio) formData.append("bio", input.bio);
    if (input.gender) formData.append("gender", input.gender);
    if (input.profilePicture)
      formData.append("profilePicture", input.profilePicture);

    try {
      setLoading(true);
      const res = await axios.patch(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        toast.success(res.data.message);
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4">
      <section className="w-full max-w-2xl mx-auto my-10 bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="font-bold text-2xl mb-6 text-center sm:text-left">
          Edit Profile
        </h1>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-gray-50 rounded-xl p-4 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>

          <input
            ref={imageRef}
            type="file"
            onChange={fileChangeHandler}
            className="hidden"
          />

          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-9 hover:bg-[#318bc7] w-full sm:w-auto"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <h1 className="text-left font-semibold mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="w-full focus-visible:ring-transparent"
            placeholder="Write something about yourself..."
          />
        </div>

        {/* Gender Section */}
        <div className="mt-6">
          <h1 className="text-left font-semibold mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          {loading ? (
            <Button className="bg-[#0095F6] hover:bg-[#0e6aa7] w-full sm:w-auto">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              className="bg-[#0095F6] hover:bg-[#0e6aa7] w-full sm:w-auto"
              onClick={editProfileHandler}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
