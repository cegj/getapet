import jsonwebtoken from "jsonwebtoken";
import { getToken } from "./get-token.mjs";

//middleware to validate token
export const verifyToken = (req, res, next) => {

  if(!req.headers.authorization){
    res.status(401).json({message: "Acesso negado!"}) 
    return
  }

  const token = getToken(req);

  if (!token){
    res.status(401).json({message: "Acesso negado!"})
    return
  }

  try {
    
    const verified = jsonwebtoken.verify(token, 'nossosecret');
    req.user = verified;
    next();

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Token inválido" })
  }

}