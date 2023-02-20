import mongoose from "mongoose";

const Otp_schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 120
      },
})


const Otp = mongoose.model('Otp', Otp_schema)
export default Otp;