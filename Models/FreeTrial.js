import mongoose from "mongoose";


const FreeTrialSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
    },
    expired:{
        type:Boolean,
        default:false
    }
})


const FreeTrial = mongoose.model('Free Trial',FreeTrialSchema)
export default FreeTrial