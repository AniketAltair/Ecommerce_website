import React, { useState } from "react";

import {BrowserRouter,Switch,Route} from 'react-router-dom'; 
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Home from "./core/home";
import PrivateRoute from "./auth/PrivateRoute";
import DashBoard from "./user/userDashBoard";
import AdminRoute from "./auth/adminRoute";
import AdminDashBoard from "./user/admindashboard";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import Shop from "./core/shop";
import Product from "./core/product";
import Cart from "./core/Cart";
import Orders from "./admin/orders";
import Profile from "./user/Profile";
import ManageProducts from "./admin/manageProducts";
import UpdateProduct from "./admin/updateProduct";

const Routes=()=>{

    
    

    return(
        <BrowserRouter> 
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/signup" exact component={Signup}/>
                <Route path="/signin" exact component={Signin}/>

                <PrivateRoute path="/user/dashboard" exact component={DashBoard} />
                <PrivateRoute path="/profile/:userId" exact component={Profile} />

                <AdminRoute path="/admin/dashboard" exact component={AdminDashBoard} />
                <AdminRoute path="/create/category" exact component={AddCategory} />
                <AdminRoute path="/create/product" exact component={AddProduct} />
                <AdminRoute path="/admin/orders" exact component={Orders} />
                <AdminRoute path="/admin/products" exact component={ManageProducts} />
                <AdminRoute path="/admin/update/product/:productId" exact component={UpdateProduct} />
                
                <Route path="/shop" exact component={Shop}/>
                <Route path="/cart" exact component={Cart}/>
                <Route path="/product/:productId" exact component={Product}/>
            </Switch>
        </BrowserRouter>
    )
}
    

export default Routes;
