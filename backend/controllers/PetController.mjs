import { getToken } from "../helpers/get-token.mjs";
import { getUserByToken } from "../helpers/get-user-by-token.mjs";
import { Pet } from "../models/Pet.mjs";

export class PetController{

  //create a pet
  static async create(req, res){

    const { name, age, weight, color } = req.body;
    const images = req.files;
    const available = true;

    //images upload (to implement)

    //validations
    if(!name){
      res.status(422).json({message: "O nome é obrigatório"});
      return
    }

    if(!age){
      res.status(422).json({message: "A idade é obrigatória"});
      return
    }

    if(!weight){
      res.status(422).json({message: "O peso é obrigatório"});
      return
    }

    if(!color){
      res.status(422).json({message: "A cor é obrigatória"});
      return
    }

    if(images.length === 0){
      res.status(422).json({message: "A imagem é obrigatória"});
      return
    }

    //get pet owner (user)
    const token = getToken(req);
    const user = getUserByToken(token, req, res);    

    //create a pet

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone
      }
    });

    images.map((image) => {
      pet.images.push(image.filename);
    })
    
    try {

      const newPet = await pet.save();
      res.status(201).json({
        message: 'Pet cadastrado com sucesso',
        newPet
      })

      
    } catch (error) {
      res.status(500).json({message: error})
    }

  }

  static async getAll(req, res){

    const pets = await Pet.find().sort('-createdAt');

    res.status(200).json({
      pets: pets
    })

  }

}