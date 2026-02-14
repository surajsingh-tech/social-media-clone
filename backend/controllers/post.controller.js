import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import Comment from "../model/comment.model.js";
import { getReceiverSocketId , io} from "../socket/socket.js";
export const addNewPost = async (req, res) => {
  try {
    const userId = req.id;
    const { caption } = req.body;
    const image = req.file;

    if (!image)
      return res
        .status(400)
        .json({ message: "Image required", success: false });

    //image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();


    //buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
    console.log("fileUri ", fileUri);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    //post create
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: userId,
    });
    //now post push in user posts
    const user = await User.findById(userId).select("-password");
    if (user) {
      user.posts.push(post._id);
      await user.save();
    } else {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    await post.populate({ path: "author", select: "-password" });
    return res.status(200).json({
      message: "New Post Added",
      success: true, 
      post,
    });
  } catch (error) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const autherId = req.id;
    const posts = await Post.find({ author: autherId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username,profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username,profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        messsge: "Post not found",
        success: false,
      });
    }

    //Like logic
    await Post.updateOne({_id : postId},{ $addToSet: { likes: likeUserId } }); //for only unique value insert in array
    await post.save();

    //Implimint socit Io for notification
    const user = await User.findById(likeUserId).select('username profilePicture')
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likeUserId)
    {
      //emit notification event
      const notification = {
        type:'like',
        userId:likeUserId,
        userDetails:user,
        postId,
        message:'Your Post was Liked'  
      }
      const postOwnerSockitID = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSockitID).emit('notificetion',notification)
    }

    return res.status(200).json({ message: "Post Like", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        messsge: "Post not found",
        success: false,
      });
    }

    //Like logic
    await Post.updateOne({_id : postId},{ $pull: { likes: likeUserId } }); //for only unique value insert in array
    await post.save();

    //Implimint socit Io for notification
    const user = await User.findById(likeUserId).select('username profilePicture')
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likeUserId)
    {
      //emit notification event
      const notification = {
        type:'dislike',
        userId:likeUserId,
        userDetails:user,
        postId,
        message:'Your Post was Liked'  
      }
      const postOwnerSockitID = getReceiverSocketId(postOwnerId)
      io.to(postOwnerSockitID).emit('notificetion',notification)
    }

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentUserId = req.id;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!text || text.trim() === "")
      res.status(400).json({ message: "Text is required", success: false });

    let comment = await Comment.create({
      text,
      author: commentUserId,
      post: postId,
    })

   await comment.populate({
      path: "author",
      select: "username profilePicture",
    });


    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: "comment added",
      comment,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate(
      "auther",
      "username profilePicture",
    ); //shortcut populate

    if (!comments) {
      return res.status(404).json({
        message: "No Comment's Found for This Post",
        success: false,
      });
    }

    return res.status(200).json({
      message: "No Comment's Found for This Post",
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post =await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    //Check if the login user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: "Unauthorized User",
        success: false,
      });
    }
    //Delete Post
    await Post.findByIdAndDelete(postId);

    //Remove the post Id from the user Post
    let user = await User.findById(authorId);

    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //Delete associated comments
    await Comment.deleteMany({ post: postId });

    res.status(200).json({
      message: "Post Deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not Found", success: false });

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(postId)) {
      // already bookmark => remove form the bookmarks
      user.bookmarks = user.bookmarks.filter((id) => id !== postId);
      await user.save();
      return res
        .status(200)
        .json({ message: "Post Remove From bookmark", success: true });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: postId } });
      await user.save();
      return res.status(200).json({ message: "Post bookmark", success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
