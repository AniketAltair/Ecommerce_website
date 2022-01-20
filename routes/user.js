const express=require('express');
//const mongoose = require('mongoose');

const router = express.Router();

const {userById,read,update,purchaseHistory} = require("../controllers/user");
const {requireSignin,isAdmin,isAuth} = require("../controllers/auth");

/*
The isAuth middleware used cause one cannot view anothers profile.
like (if isAuth is not there) then after login to our account, we can view another account.(like needed in facebook app)
but here no need to view others profile, so isAuth used.
Basically, user is authenticated but unauthorized to view others content 
Similiarly, we use isAdmin middleware to authorize if he has admin access.
*/
router.get('/secret/:userId',requireSignin,isAuth,(req,res)=>{   
    res.json({ 
        user: req.profile
    });
});

router.get('/user/:userId',requireSignin,isAuth,read);
router.put('/user/:userId',requireSignin,isAuth,update);
router.get('/orders/by/user/:userId',requireSignin,isAuth,purchaseHistory);

router.param('userId',userById);

module.exports=router;