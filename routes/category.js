const express=require('express');
//const mongoose = require('mongoose');

const router = express.Router();

const {create,categoryById,read,update,remove,list} = require("../controllers/category");
const {userById} = require("../controllers/user");
const {requireSignin,isAdmin,isAuth} = require("../controllers/auth");
const category = require('../models/category');


router.get('/category/:categoryId',read);
router.get('/categories',list)
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin,create);
router.put("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,update);
router.delete("/category/:categoryId/:userId",requireSignin,isAuth,isAdmin,remove);

router.param('categoryId',categoryById);
router.param('userId',userById);

module.exports=router;