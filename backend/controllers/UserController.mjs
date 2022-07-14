import { User } from "../models/User.mjs";
import bcrypt from "bcrypt";
import { createUserToken } from "../helpers/create-user-token.mjs";
import { getToken } from "../helpers/get-token.mjs";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import { getUserByToken } from "../helpers/get-user-by-token.mjs";

export default class UserController{
  static async register(req, res){

    const { name, email, phone, password, confirmpassword } = req.body;

    // validations

    if(!name){
      res.status(422).json({message: "O nome é obrigatório"});
      return
    }

    if(!email){
      res.status(422).json({message: "O e-mail é obrigatório"});
      return
    }

    if(!phone){
      res.status(422).json({message: "O telefone é obrigatório"});
      return
    }

    if(!password){
      res.status(422).json({message: "A senha é obrigatória"});
      return
    }

    if(!confirmpassword){
      res.status(422).json({message: "A confirmação de senha é obrigatória"});
      return
    }

    if (password !== confirmpassword){
      res.status(422).json({message: "A senha e a confirmação de senha devem ser iguais"});
      return  
    }

    // check if user exists
    const userExists = await User.findOne({email: email});
    if (userExists){
      res.status(422).json({message: "Por favor, utilize outro e-mail"});
      return  
    }

    //create a password

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    })

    try {

      const newUser = await user.save();
      await createUserToken(newUser, req, res);

    } catch (error) {
      res.status(500).json({message: error})      
    }
  }

  static async login(req, res){

    const { email, password } = req.body;

    if (!email){
      res.status(422).json({message: "O e-mail é obrigatório"})
      return
    }
    
    if (!password){
      res.status(422).json({message: "A senha é obrigatória"})
      return
    }

    //Check if user exists
    const user = await User.findOne({email: email});
    if (!user){
      res.status(422).json({message: "Não há usuário cadastrado com este e-mail"});
      return  
    }

    //Check if password match with db password
    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword){
      res.status(422).json({message: "Senha inválida"});
      return  
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res){
    let currentUser;

    console.log(req.headers.authorization)

    if (req.headers.authorization){

      const token = getToken(req);
      const decoded = jsonwebtoken.verify(token, 'nossosecret');
      currentUser = await User.findById(decoded.id);
      currentUser.password = undefined; 

    } else{
      currentUser = null;
    }

    res.status(200).send(currentUser);
  }

  static async getUserById(req, res){

    const id = mongoose.Types.ObjectId(req.params.id);

    const user = await User.findById(id).select("-password");

    if(!user){
      res.status(422).json({message: "Usuário não encontrado"});
      return
    }

    res.status(200).json({user});
  }

  static async editUser(req, res){

    const {name, email, phone, password, confirmpassword} = req.body;

    //check if user exists
    const token = await getToken(req);
    const user = await getUserByToken(token);

    if(req.file){
      user.image = req.file.filename; 
     }
     
    //check if user exists
    if(!user){
      res.status(422).json({message: "Usuário não encontrado"});
      return
    }

    //validations

    if(!name){
      res.status(422).json({message: "O nome é obrigatório"});
      return
    }

    user.name = name;

    if(!email){
      res.status(422).json({message: "O e-mail é obrigatório"});
      return
    }

    // check if e-mails is already took
    const userExists = await User.findOne({email: email});
    if(user.email !== email && userExists){
      res.status(422).json({message: "O e-mail está sendo usado por outro usuário"});
      return
    }
    
    user.email = email;

    if(!phone){
      res.status(422).json({message: "O telefone é obrigatório"});
      return
    }

    user.phone = phone;

    if (password != confirmpassword){
      res.status(422).json({ message: "As senhas não conferem"})
      return
    } else if (password != null) {
      
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);  

      user.password = passwordHash;

    }

    try {

      const updatedUser = await User.findOneAndUpdate(
      {_id: user.id},
      {$set: user},
      {new: true}
      )

      res.status(200).json({message: "Usuário atualizado com sucesso", updatedUser});
      
    } catch (error) {
      
      res.status(500).json({message: error});
      return

    }

  }
}