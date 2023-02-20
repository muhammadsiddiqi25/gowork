import mongoose from "mongoose";

const candid_schema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    phone_name:{
        type:String,
        required:true
    },
    dob:{
        type:Date,
        required:true
    },
    martial_staus:{
        type:String,
        required:true,
        enum:['married','single','divorced']
    },
    CNIC:{
        type:String,
        required:true
    },
    perm_addr:{
        type:String,
        required:true
    },
    temp_addr:{
        type:String,
        required:true
    },
    night_shif:{
        type:Boolean,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    }
})


const candidates  = mongoose.model('Candidates',candid_schema)
export default candidates