const express=require('express');
const router = express.Router();

const {userById} = require("../controllers/user");
const {requireSignin,isAuth} = require("../controllers/auth");
const {generateToken,processpayment} = require("../controllers/braintree");


router.get('/braintree/getToken/:userId',requireSignin,isAuth,generateToken);
router.post('/braintree/payment/:userId',requireSignin,isAuth,processpayment);

router.param('userId',userById);

module.exports =router;