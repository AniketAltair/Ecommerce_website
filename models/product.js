const mongoose=require('mongoose');
const {ObjectId} = mongoose.Schema;

const productSchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true,
        maxlength:32
    },
    description:{
        type: String,
        required:true,
        maxlength:2000
    },
    price:{
        type: Number,
        trim: true,
        required:true,
        maxlength:32
    },
    category:{
        type: ObjectId,       // like this we do to create relationship among diff schemas in nodejs
        ref:'Category',
        required:true,
    },
    quantity:{
        type: Number,
    },
    sold:{                 // how many of such items are sold in total
        type: Number,
        default:0
    },
    photo:{
        data: Buffer,        // stores binary data 
        contentType: String
    },
    shipping:{        // some products not shippable, some shippable
        required:false,
        type:Boolean
    }
},
{timestamps:true}
);

module.exports=mongoose.model("Product",productSchema);