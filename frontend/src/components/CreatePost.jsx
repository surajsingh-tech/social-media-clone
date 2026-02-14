import * as Dialog from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { DialogContent, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "../lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "@/redux/postSlice";

export default function CreatePost({ open, setOpen }) {
  const imageRef = useRef();
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const {user}=useSelector(state=>state.auth)
  const dispatch=useDispatch()
  const {posts}=useSelector(state=>state.post)
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    setLoading(true);
    if (file) {
      // Only Image File allow 
      if (file.type.startsWith("image/")) {
        setFile(file);
        try {
          const dataUrl = await readFileAsDataUrl(file);
          setImagePreview(dataUrl);
        } catch (error) {
          console.error("File preview error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setFile("");
        setImagePreview("");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) {
      formData.append("image", file);
    }
    setLoading(true);
    try {
      const res =await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
         formData ,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );
      
      if(res.data.success)
      {
         toast.success(res.data.message);
         dispatch(setPost([res.data.post,...posts]))
         setOpen(false)
         setCaption('')
         setFile('')
         setImagePreview('')
      }
      
    } catch (error) {
       toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6">
        <DialogTitle>
          <VisuallyHidden>Create Post</VisuallyHidden>
        </DialogTitle>

        {/* User Info */}
        <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="User avatar" />
            <AvatarFallback>Cn</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="font-semibold text-sm sm:text-base">{user?.username??''}</h1>
            <span className="text-gray-600 text-xs sm:text-sm">
              {user?.bio??''} 
            </span>
          </div>
        </div>

        {/* Caption */}
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="mt-3 focus-visible:ring-transparent border-none text-sm sm:text-base"
          placeholder="Write a caption..."
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="w-full mt-3 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="Preview"
              className="object-cover w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 rounded-md"
            />
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={fileChangeHandler}
          aria-label="Upload image"
        />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={() => imageRef.current.click()}
            className="w-full sm:w-1/2 bg-[#0095f6] hover:bg-[#258bcf]"
          >
            Select From Device
          </Button>

          {loading && (
            <Button disabled className="w-full sm:w-1/2">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          )}
          {!loading && file && (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full sm:w-1/2"
            >
              Send
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog.Root>
  );
}
