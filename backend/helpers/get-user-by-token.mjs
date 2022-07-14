import jsonwebtoken from "jsonwebtoken";
import { User } from "../models/User.mjs";

//get user by jtw token

export const getUserByToken = async (token, req, res) => {


  if (!token){
    return res.status(401).json({ message: 'Acesso negado!' });
  }

  const decoded = jsonwebtoken.verify(token, "nossosecret");

  const user = await User.findOne({_id: decoded.id});

  return user;

}