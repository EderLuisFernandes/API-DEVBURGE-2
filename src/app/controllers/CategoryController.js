import * as Yup from "yup"
import Category from "../models/Category";
import User from "../models/User";


class CategoryController{
 async store(request,response){
  const Schema = Yup.object({
    name: Yup.string().required(),
    
  });
 
  

  try{
    Schema.validateSync(request.body,{abortEarly:false})
  }catch(err){
    return response.status(400).json({ error: err.errors})
  }
  const  { admin: isAdmin} = await User.findByPk(request.userId)
  if(!isAdmin){
    return response.status(401).json({message: "Voce não é administrador"})
  }

  const { name} = request.body;
  const categoryExist =await Category.findOne({
    where: {
      name,
    }
  })
   if(categoryExist){
    return response.status(400).json({error: 'Categoria ja Existe'})
   }
  const {id} = await Category.create({
    name,
  })
  return response.status(201).json({id ,name})
 }
 async index(request,response){
  const category = await Category.findAll()

  return response.json(category)
 }
}

export default new CategoryController()