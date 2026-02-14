import { setSuggestUser } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/suggested", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSuggestUser(res.data.users))
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestUser();
  }, []);
};

export default useGetSuggestedUser;
