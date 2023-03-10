import Pricing from "../Models/Pricing.js";


export const get_pricing = async (req,resp)=>{
    const price = await Pricing.find({})
    return resp.status(200).json(price)
}


export const set_pricing = async (req,resp)=>{
    const {_id,title,duration,discound,connects,price} = req.body
    Pricing.findByIdAndUpdate({_id},{title,duration,discound,connects,price},(err,doc)=>{
        console.log(doc)
        if(doc){
            return resp.status(200)
        }
        else{
            return resp.status(400)
        }
    })
}