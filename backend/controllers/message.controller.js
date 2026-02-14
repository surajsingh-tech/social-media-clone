import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import Conveesation from "../model/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;
 
    let conversation = await Conveesation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conveesation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await conversation.save() 

    //Impliment Sockit Io For Real Time Data Transfer
    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
      io.to(receiverSocketId).emit('newMessage',newMessage)
    }
    
    return res.status(200).json({
      newMessage,
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

export const getMesssage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conveesation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // old → new order
    }); 

    if (!conversation)
      return res.status(200).json({ messages: [], success: true });

    res.status(200).json({ messages: conversation?.messages, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
