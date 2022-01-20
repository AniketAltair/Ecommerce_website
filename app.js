const express=require('express');
const mongoose = require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const expressvalidator = require('express-validator')
const cors=require('cors') // used for connecting with frontend
const { use } = require('./routes/auth');
const app=express();
require('dotenv').config();

const authroutes=require('./routes/auth');
const userroutes=require('./routes/user');
const categoryroutes=require('./routes/category');
const productroutes=require('./routes/product');
const braintreeroutes=require('./routes/braintree');
const orderroutes=require('./routes/order');

mongoose.connect(
    process.env.MONGO_URI,
    {useNewUrlParser: true}
  )
  .then(() => console.log('DB Connected'))
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });

  app.use(morgan("dev"));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressvalidator());
  app.use(cors());

  //routes middleware
  app.use('/auth',authroutes);
  app.use('/user',userroutes);
  // can use same as path is anyways going to be different
  
  app.use('/api',categoryroutes);
  app.use('/api',productroutes);
  app.use('/api',braintreeroutes);
  app.use('/api',orderroutes);




const port = process.env.PORT || 8000;

//heroku deployment

if(process.env.NODE_ENV == "production"){
  app.use(express.static("ecommerce-front/build"));
  const path=require("path");
  app.get("*",(reeq,res)=>{
    res.sendFile(path.resolve(__dirname,'ecommerce-front','build','index.html'));
  })
}

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});