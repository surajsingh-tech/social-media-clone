import { setSuggestUser, setUserInfo } from "@/redux/authSlice";
import { setPost } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserInfo = (userId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/getUser/${userId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setUserInfo(res.data.user))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserInfo();
  }, [userId]);
};

export default useGetUserInfo;
