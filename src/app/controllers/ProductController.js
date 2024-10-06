import * as Yup from "yup"
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";


class ProductController{
 async store(request,response){
  const Schema = Yup.object({
    name: Yup.string().required(),
    price: Yup.number().required(),
    category_id: Yup.number().required(),
    offer: Yup.boolean(),
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

   const {filename: path} = request.file

  const { name, price , category_id, offer} = request.body

  const product = await Product.create({
    name,
    price,
    category_id,
    path,
    offer,
  })
  return response.status(201).json(product)
 }
 async index(request,response){
  const products = await Product.findAll({
    include: [
      {
        model: Category,
        as:   'category',
        attributes: ['id','name']
      
      }
    ]
  })

  return response.json(products)
 }
}

export default new ProductController()