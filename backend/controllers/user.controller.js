import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).send({
        message: "Something is missing , please check",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).send({
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

      return res.status(201).send({
        message: "Account Create Successfully",
        success: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};


