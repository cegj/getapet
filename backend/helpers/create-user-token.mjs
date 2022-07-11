import jsonwebtoken from "jsonwebtoken";

export const createUserToken = async(user, req, res) => {

  //create a token
  const token = jsonwebtoken.sign({
    name: user.name,
    id: user._id
  }, "nossosecret")

  //return token
  res.status(200).json({
    message: "Você está autenticado",
    token,
    userId: user._id
  })
}