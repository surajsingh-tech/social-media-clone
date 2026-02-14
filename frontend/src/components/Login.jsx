import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const dispatch=useDispatch()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth)

  let getInput = (e) => {
    let { name, value } = e.target;
    setInput((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  let postData = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

   useEffect(()=>{
    if(user)
    {
      navigate('/')
    }
  },[])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-sm sm:max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">LoGO</CardTitle>
          <p className="text-sm text-muted-foreground">
            Login to see photos and videos from your friends
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              postData(e);
            }}
          >
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                className="my-2"
                value={input.email}
                onChange={(e) => {
                  getInput(e);
                }}
                type="email"
                name="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                className="my-2"
                value={input.password}
                onChange={(e) => {
                  getInput(e);
                }}
                type="password"
                name="password"
                placeholder="Create password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
            <span className="text-sm text-center mt-4">
              Dose't have an account?
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline mx-2"
              >
                Signup
              </Link>
            </span>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
