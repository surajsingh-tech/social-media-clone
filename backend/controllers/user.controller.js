import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import Post from "../model/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body.input;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something is missing , please check",
        success: false,
      })
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Email already exist Try differrent email",
        success: false,
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        message: "Account Create Successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}; 


export const getUserDetails =async (req,res)=>{
  try {
    const userId=req.params.id;
    let user = await User.findById(userId).select('-password')
    if(user){
     return res.status(200).json({
        success:true,
        user:user
      })
    }
    else{
      return res.status(404).json({
        success:false,
        message:'User not found'
      })
    }
  } catch (error) {
     console.log(error);
     return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email and password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email and password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //populate each post id in post array
    const populatePosts = await Promise.all(
      user?.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post?.author?.equals(user._id)) {
          return post;
        }
        return null;
      }),
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: `Logged Out Successfully`,
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID",
        success: false,
      });
    }

    let user = await User.findById(userId).populate({path:'posts' , createdAt:-1 }).populate({path:'bookmarks'});

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id; // from middleware
    const { bio, gender } = req.body;
   
    
    const profilePicture = req.file;
    let cloudResponse;

    // DB  user fetch
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Flag to check agar koi field update hui ya nahi
    let updated = false;

    // 1️ Bio update (sirf agar non-empty string ho)
    if (bio && bio.trim() !== "") {
      user.bio = bio.trim();
      updated = true;
    }

    // 2️ Gender update (sirf valid values)
    if (gender) {
      if (!["male", "female", "other"].includes(gender)) {
        return res.status(400).json({
          message: "Invalid gender value",
          success: false,
        });
      }
      user.gender = gender;
      updated = true;
    }

    // 3️ Profile picture update
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          message: "Image upload failed",
          success: false,
        });
      } else {
        user.profilePicture = cloudResponse.secure_url;
        updated = true;
      }
    }

    // Agar nothing update
    if (!updated) {
      return res.status(400).json({
        message: "No valid fields to update",
        success: false,
      });
    }

    // Save changes
    await user.save();

    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password",
    );
   

    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
        success: false,
      });
    } else {
      return res.status(200).json({
        users: suggestedUsers,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const followOrUnfollow = async (req, res) => {
  try {
    const currentUserId = req.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You can't follow yourself",
        success: false,
      });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      await Promise.all([
        User.updateOne(
          { _id: currentUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: currentUserId } }
        ),
      ]);

      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
        follow: false,
      });
    }

    // FOLLOW
    await Promise.all([
      User.updateOne(
        { _id: currentUserId },
        { $addToSet: { following: targetUserId } }
      ),
      User.updateOne(
        { _id: targetUserId },
        { $addToSet: { followers: currentUserId } }
      ),
    ]);

    return res.status(200).json({
      message: "Followed successfully",
      success: true,
      follow: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
