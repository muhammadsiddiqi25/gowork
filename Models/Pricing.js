import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    duration:{
        type:Number,
        required:true,
    },
    discount:{
        type:Number,
        required:true
    },
    connects:{
        type:Number,
        required:true
    }
},
)

const Pricing = mongoose.model("Pricing", PricingSchema)
export default Pricing