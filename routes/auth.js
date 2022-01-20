const express=require('express');
//const mongoose = require('mongoose');

const router = express.Router();

const {signup,signin,signout,requireSignin} = require("../controllers/auth");
const {userSignupValidator} = require("../validators")

router.post("/signup",userSignupValidator,signup);
router.post("/signin",signin);
router.post("/signout",signout);

/*router.post("/signup",(req,res)=>{
    console.log(req.body);
    res.send(req.body);
});*/


router.get("/hello",requireSignin,(req,res)=>{
    res.send("hello from 111");
}); 

module.exports=router;