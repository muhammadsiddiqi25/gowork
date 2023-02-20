import Pricing from "../Models/Pricing.js";


export const get_pricing = async (req,resp)=>{
    const price = await Pricing.find({})
    return resp.status(200).json(price)
}