const Product=require('../models/product');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs=require('fs');
const formidable = require('formidable'); // used for dealing with form data.
const _ = require('lodash');


exports.productById = (req, res, next, id) => {
    Product.findById(id)
    .populate("category")
        .exec((err, product) => {
            if (err || !product) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }
            req.product = product;
            next();
        });
};

exports.read = (req, res) => {
    req.product.photo = undefined; // will make diff method for photo retrival as that will be efficient
    return res.json(req.product);
};






/* 
formidable used for dealing with form data.
we will be uploading image as well in frontend, so normal passing data through req wont
work here.
So we use form in frontend.
*/


exports.create = (req, res) => {

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  // whatever img type we get, extensions will be there
    form.parse(req,(err,fields,files)=>{

        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded."    
            });
        }

        const {name,description,price,category,quantity,shipping}=fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:"All fields are required"    
            });
        }

        let product =new Product(fields);

        console.log("##############");
        console.log(files.photo.filepath);  // replace  with files.photo.filepath when working with postman
                                            // also with postman, save image to C://users//admin//Postman//files
        console.log("##############");


        if(files.photo){

            if(files.photo.size>1000000){
                return res.status(400).json({
                    error:"Image should be less than 1 mb"    
                });
            }

            product.photo.data=fs.readFileSync(files.photo.filepath);
            product.photo.contentType=files.photo.mimetype;          // with postman and above with commentlines,here use files.photo.mimetype
        }

        product.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                });
            }
            res.json(result);
        });

    });
};


exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Product deleted successfully'
        });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        let product = req.product;
        product = _.extend(product, fields);  // Lodash is a JavaScript library which provides utility functions for 
                                              //common programming tasks. It uses functional programming paradigm.

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            product.photo.data = fs.readFileSync(files.photo.filepath);
            product.photo.contentType = files.photo.mimetype;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

 exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select('-photo') // means we are not selecting photos as binary images huge in size, thus we can deselect by using '-'
        .populate('category') // look at meaning of populate method : https://www.geeksforgeeks.org/mongoose-populate-method/
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */


exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category }) // $ne used in mongodb nodejs means not including, in this case,
        .limit(limit)                                                           // we dont want that product to be included in list related pr0duct list
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};


exports.listCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {  // distinct: get all categories distinct to product model THAT are used
                                                             // like if total are 4 categories, but as of now only used 2 categories in product model
                                                             // so we will display only 2 categories 
        if (err) {
            return res.status(400).json({
                error: 'Categories not found'
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};                    
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log("*************");
    console.log(findArgs);
    console.log("*************");

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found!!!"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType); // 
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }   
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    console.log("++++!!!!!!!!!!!!!!====");
    console.log(bulkOps);
    console.log("++++!!!!!!!!!!!!!!====");

    Product.bulkWrite(bulkOps, {}, (error, products) => { // see documentation for bulkWrite
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });

}