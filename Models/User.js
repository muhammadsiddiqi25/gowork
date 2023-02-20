import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['candidate','employer','blogger','admin']
    },
    verified:{
        type:Boolean,
        default:false,
    }

},
{
    timestamps:true
})

const User = mongoose.model("User", UserSchema)
export default User