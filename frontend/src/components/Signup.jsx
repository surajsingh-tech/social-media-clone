import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function Signup() {
  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
  });

  console.log("input ",input);
  
   const {user} = useSelector(store=>store.auth)
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        "http://localhost:8000/api/v1/user/register",
        {input},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({
          email: "",
          username: "",
          password: "",
        });
        navigate("/login");
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
            Sign up to see photos and videos from your friends
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
              <Label>Username</Label>
              <Input
                className="my-2"
                value={input.username}
                onChange={(e) => {
                  getInput(e);
                }}
                type="text"
                name="username"
                placeholder="Choose a username"
              />
            </div>

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
                "Sign Up"
              )}
            </Button>

            <span className="text-sm text-center mt-4">
              Already have an account?
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline mx-2"
              >
                Login
              </Link>
            </span>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
