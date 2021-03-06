const mongoose=require('mongoose');
const crypto=require('crypto');
const { 
    v1: uuidv1,
    v4: uuidv4,
  } = require('uuid');

const userSchema=new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true,
        maxlength:32
    },
    email:{
        type: String,
        trim: true,
        required:true,
        unique:true
    },
    hashed_password:{
        type: String,
        required:true
    },
    about:{
        type: String,
        trim: true,
    },
    salt: String, // used for recovery of hashed password
    role: {
        type:Number, // type number=0 means authenticated user, type number=1 means admin
        default:0
    },
    history:{     // to know customers purchase history
        type:Array, 
        default:[]
    }
},
{timestamps:true}
);



//virtual fields and methods

userSchema.virtual("password")
.set(function(password){
    this._password=password;
    this.salt=uuidv1();
    this.hashed_password=this.encryptPassword(password);
})
.get(function(){
    return this._password;
});

userSchema.methods={
    
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto.createHmac('sha1',this.salt).update(password).digest('hex');
        }catch(err){
            return "";
        }
    }
};

module.exports=mongoose.model("User",userSchema);

