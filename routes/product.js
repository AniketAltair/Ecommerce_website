const express=require('express');
//const mongoose = require('mongoose');

const router = express.Router();

const {create,productById,read,remove,update,list,listRelated,listCategories,listBySearch,photo,listSearch} = require("../controllers/product");
const {userById} = require("../controllers/user");
const {requireSignin,isAdmin,isAuth} = require("../controllers/auth");

router.get('/product/:productId',read);
router.post('/product/create/:userId',requireSignin,isAuth,isAdmin,create);
router.delete('/product/:productId/:userId',requireSignin,isAuth,isAdmin,remove);
router.put('/product/:productId/:userId',requireSignin,isAuth,isAdmin,update);

router.get('/products',list);
router.get("/products/search", listSearch);
router.get('/product/related/:productId',listRelated);
router.get('/products/categories',listCategories);
router.post('/products/by/search', listBySearch);
router.get('/products/photo/:productId', photo);

router.param('userId',userById);
router.param('productId',productById);

module.exports=router;  